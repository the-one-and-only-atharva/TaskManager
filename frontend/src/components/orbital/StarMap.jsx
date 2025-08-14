import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useImperativeHandle,
} from "react";
import { DndContext } from "@dnd-kit/core";
import { select } from "d3-selection";
import { zoom as d3Zoom, zoomIdentity } from "d3-zoom";
import DraggableNode from "./DraggableNode";
import { getPlanetSvg, getMoonSvg } from "../../constants/space";
import supernovaSvg from "../../assets/supernova.svg";
import { resolveNonOverlapPosition } from "../../utils/orbit";

// Deterministic pseudo-random from string id (for phases/speeds)
function hashToUnitInterval(input) {
  let hash = 2166136261 >>> 0; // FNV-1a
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

// Keep local visual layout constants to preserve existing StarMap visuals
const PLANET_ORBIT_RADIUS_BASE = 96;
const PLANET_ORBIT_RADIUS_STEP = 64;
const MOON_ORBIT_RADIUS_BASE = 48;
const MOON_ORBIT_RADIUS_STEP = 24;

// props:
// stars: Array<{ id, name, x, y, planets: Array<{ id, name, moons: Array<{ id, name }> }> }>
// onStarPositionChange: (starId: string, newX: number, newY: number) => void
// onStarClick: (star: Star) => void
const StarMap = React.forwardRef(function StarMap(
  { stars, onStarPositionChange, onStarClick },
  ref
) {
  const svgRef = useRef(null);
  const gRef = useRef(null);
  const zoomTransformRef = useRef(zoomIdentity);
  const [animationTickMs, setAnimationTickMs] = useState(0);
  const [draggingStarId, setDraggingStarId] = useState(null);

  const starById = useMemo(() => {
    const map = new Map();
    for (const star of stars ?? []) map.set(star.id, star);
    return map;
  }, [stars]);

  const handleDragEnd = (event) => {
    const { active, delta } = event;
    const scale = zoomTransformRef.current.k || 1;
    const id = String(active?.id || "");
    if (!id.startsWith("star-")) return;
    const starId = id.replace("star-", "");
    const star = starById.get(starId);
    if (!star) return;
    const proposedX = star.x + delta.x / scale;
    const proposedY = star.y + delta.y / scale;
    const others = (stars ?? []).filter((s) => s.id !== starId);
    const { x: resolvedX, y: resolvedY } = resolveNonOverlapPosition(
      star,
      others,
      proposedX,
      proposedY
    );
    onStarPositionChange?.(starId, resolvedX, resolvedY);
    setDraggingStarId(null);
  };

  const handleDragStart = (event) => {
    const id = String(event?.active?.id || "");
    if (!id.startsWith("star-")) return;
    const starId = id.replace("star-", "");
    setDraggingStarId(starId);
  };

  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;
    const svgSelection = select(svgRef.current);
    const gSelection = select(gRef.current);

    const zoomBehavior = d3Zoom()
      .scaleExtent([0.5, 5])
      .filter((event) => {
        if (
          event.type === "wheel" ||
          event.type === "touchstart" ||
          event.type === "touchmove"
        ) {
          return true;
        }
        const target = event.target;
        if (
          target &&
          typeof target.closest === "function" &&
          target.closest(".draggable-node")
        ) {
          return false;
        }
        return true;
      })
      .on("zoom", (event) => {
        gSelection.attr("transform", event.transform);
        zoomTransformRef.current = event.transform;
      });

    svgSelection.call(zoomBehavior);
    return () => {
      svgSelection.on(".zoom", null);
    };
  }, []);

  // Expose imperative API to parent for computing world-coordinate center
  useImperativeHandle(ref, () => ({
    getWorldCenter: () => {
      if (!svgRef.current) return { x: 0, y: 0 };
      const rect = svgRef.current.getBoundingClientRect();
      const centerScreenX = rect.width / 2;
      const centerScreenY = rect.height / 2;
      const t = zoomTransformRef.current || zoomIdentity;
      const k = t.k || 1;
      return {
        x: (centerScreenX - t.x) / k,
        y: (centerScreenY - t.y) / k,
      };
    },
  }));

  // Animation loop for orbital motion
  useEffect(() => {
    let rafId;
    const startTime = performance.now();
    const animate = (now) => {
      setAnimationTickMs(now - startTime);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const renderStarSystem = (star, index) => {
    return (
      <g key={star.id}>
        <DraggableNode id={`star-${star.id}`} x={star.x} y={star.y}>
          <image href={supernovaSvg} width="80" height="80" x="-40" y="-40" />
          <text
            x={0}
            y={50}
            textAnchor="middle"
            className="fill-white text-sm select-none"
          >
            {star.name}
          </text>

          {/* Hover Edit Button (hidden while dragging) */}
          <g
            transform="translate(44 -58)"
            className={`${
              draggingStarId === star.id
                ? "hidden"
                : "opacity-0 group-hover:opacity-100"
            } transition-opacity duration-150 pointer-events-auto`}
            style={{ cursor: "pointer" }}
            onPointerDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onClick={(e) => {
              e.stopPropagation();
              onStarClick?.(star);
            }}
          >
            <rect
              x="-32"
              y="-16"
              rx="10"
              width="64"
              height="32"
              fill="rgba(255,255,255,0.12)"
              stroke="rgba(255,255,255,0.25)"
            />
            <text
              x="0"
              y="6"
              textAnchor="middle"
              className="fill-white text-md select-none"
            >
              Edit
            </text>
          </g>
        </DraggableNode>

        {star.planets?.map((planet, pIndex) => {
          const orbitRadius =
            PLANET_ORBIT_RADIUS_BASE + pIndex * PLANET_ORBIT_RADIUS_STEP;
          // Period between 18s and 36s depending on index, with slight id-based jitter
          const basePeriodSeconds = 18 + pIndex * 6;
          const jitter =
            (hashToUnitInterval(planet.id || String(pIndex)) - 0.5) * 4; // +/-2s
          const periodSeconds = Math.max(8, basePeriodSeconds + jitter);
          const angularVelocity = (Math.PI * 2) / periodSeconds; // rad/s
          const basePhase =
            hashToUnitInterval(planet.id || String(pIndex)) * Math.PI * 2;
          const direction = pIndex % 2 === 0 ? 1 : -1;
          const tSeconds = animationTickMs / 1000;
          const angle = basePhase + direction * angularVelocity * tSeconds;
          const px = star.x + Math.cos(angle) * orbitRadius;
          const py = star.y + Math.sin(angle) * orbitRadius;
          const planetSvg = getPlanetSvg(pIndex);
          return (
            <g key={planet.id}>
              {/* Orbit path */}
              <circle
                cx={star.x}
                cy={star.y}
                r={orbitRadius}
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth={1}
              />

              {/* Planet at current orbital position */}
              <g transform={`translate(${px} ${py})`}>
                <image
                  href={planetSvg}
                  width="40"
                  height="40"
                  x="-20"
                  y="-20"
                />
                <text
                  x={0}
                  y={34}
                  textAnchor="middle"
                  className="fill-white/85 text-xs select-none"
                >
                  {planet.name}
                </text>

                {/* Moon orbits around the planet */}
                {planet.moons?.map((moon, mIndex) => {
                  const moonOrbitRadius =
                    MOON_ORBIT_RADIUS_BASE + mIndex * MOON_ORBIT_RADIUS_STEP;
                  const baseMoonPeriodSeconds = 6 + mIndex * 2;
                  const moonJitter =
                    (hashToUnitInterval(moon.id || String(mIndex)) - 0.5) * 1.4; // +/-0.7s
                  const moonPeriodSeconds = Math.max(
                    3,
                    baseMoonPeriodSeconds + moonJitter
                  );
                  const moonAngularVelocity = (Math.PI * 2) / moonPeriodSeconds;
                  const moonPhase =
                    hashToUnitInterval(moon.id || String(mIndex)) * Math.PI * 2;
                  const moonDirection = mIndex % 2 === 0 ? -1 : 1; // alternate opposite direction
                  const moonAngle =
                    moonPhase + moonDirection * moonAngularVelocity * tSeconds;
                  const mx = Math.cos(moonAngle) * moonOrbitRadius;
                  const my = Math.sin(moonAngle) * moonOrbitRadius;
                  const moonSvg = getMoonSvg(mIndex);
                  return (
                    <g key={moon.id}>
                      <circle
                        cx={0}
                        cy={0}
                        r={moonOrbitRadius}
                        fill="none"
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth={1}
                      />
                      <g transform={`translate(${mx} ${my})`}>
                        <image
                          href={moonSvg}
                          width="20"
                          height="20"
                          x="-10"
                          y="-10"
                        />
                        <text
                          x={0}
                          y={18}
                          textAnchor="middle"
                          className="fill-white/80 text-[10px] select-none"
                        >
                          {moon.name}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <div className="relative">
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <svg
          ref={svgRef}
          className="w-[98%] h-[96vh] mx-auto my-4 bg-transparent backdrop-blur-sm border-2 border-white/10 rounded-3xl"
          style={{ touchAction: "none" }}
        >
          <g ref={gRef}>{(stars ?? []).map(renderStarSystem)}</g>
        </svg>
      </DndContext>

      {(stars?.length ?? 0) === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-3xl">
          <div className="pointer-events-auto text-center px-6 py-5 rounded-2xl bg-white/10 backdrop-blur-lg">
            <p className="text-white text-lg font-semibold">No stars present</p>
            <p className="text-white/80 text-sm mt-1">
              Add a star to begin building your StarMap.
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

export default StarMap;
