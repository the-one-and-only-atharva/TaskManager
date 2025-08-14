import React, { useEffect, useRef, useState } from "react";
import {
  ORBIT_CONFIG,
  getPlanetSvg,
  getMoonSvg,
  supernovaSvg,
} from "../../constants/space";
import { select } from "d3-selection";
import { zoom as d3Zoom } from "d3-zoom";

function hashToUnitInterval(input) {
  let hash = 2166136261 >>> 0;
  const str = String(input);
  for (let i = 0; i < str.length; i += 1) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

const SystemPreview = ({ star, onSelect }) => {
  const [tickMs, setTickMs] = useState(0);
  const svgRef = useRef(null);
  const gRef = useRef(null);

  useEffect(() => {
    let rafId;
    const start = performance.now();
    const animate = (now) => {
      setTickMs(now - start);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const VIEW_W = 900;
  const VIEW_H = 600;
  const CX = VIEW_W / 2;
  const CY = VIEW_H / 2;
  const TIME_SCALE = 0.5; // slow down the orbital animation a bit
  const tSeconds = (tickMs / 1000) * TIME_SCALE;

  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;
    const svgSel = select(svgRef.current);
    const gSel = select(gRef.current);
    const zoomBehavior = d3Zoom()
      .scaleExtent([0.7, 2.5])
      .translateExtent([
        [-200, -150],
        [VIEW_W + 200, VIEW_H + 150],
      ])
      .on("zoom", (event) => {
        gSel.attr("transform", event.transform);
      });
    svgSel.call(zoomBehavior);
    return () => {
      svgSel.on(".zoom", null);
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          style={{ touchAction: "none" }}
          onClick={(e) => {
            // Only treat clicks on the blank background as a request to edit the system name
            if (e.currentTarget === e.target) {
              onSelect?.(null);
            }
          }}
        >
          <g ref={gRef}>
            <image
              href={supernovaSvg}
              width={ORBIT_CONFIG.STAR_ICON_HALF_SIZE * 2}
              height={ORBIT_CONFIG.STAR_ICON_HALF_SIZE * 2}
              x={CX - ORBIT_CONFIG.STAR_ICON_HALF_SIZE}
              y={CY - ORBIT_CONFIG.STAR_ICON_HALF_SIZE}
            />
            <text
              x={CX}
              y={CY + ORBIT_CONFIG.STAR_ICON_HALF_SIZE + 20}
              textAnchor="middle"
              className="fill-white text-sm select-none"
            >
              {star?.name}
            </text>

            {star?.planets?.map((planet, pIndex) => {
              const orbitRadius =
                ORBIT_CONFIG.PLANET_ORBIT_RADIUS_BASE +
                pIndex * ORBIT_CONFIG.PLANET_ORBIT_RADIUS_STEP;

              const basePeriodSeconds = 18 + pIndex * 6;
              const jitter =
                (hashToUnitInterval(planet.id || pIndex) - 0.5) * 4;
              const periodSeconds = Math.max(8, basePeriodSeconds + jitter);
              const angularVelocity = (Math.PI * 2) / periodSeconds;
              const basePhase =
                hashToUnitInterval(planet.id || pIndex) * Math.PI * 2;
              const direction = pIndex % 2 === 0 ? 1 : -1;
              const angle = basePhase + direction * angularVelocity * tSeconds;
              const px = CX + Math.cos(angle) * orbitRadius;
              const py = CY + Math.sin(angle) * orbitRadius;
              const planetSvg = getPlanetSvg(pIndex);

              return (
                <g key={planet.id || pIndex}>
                  <circle
                    cx={CX}
                    cy={CY}
                    r={orbitRadius}
                    fill="none"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth={1}
                  />
                  <g transform={`translate(${px} ${py})`}>
                    <image
                      href={planetSvg}
                      width={ORBIT_CONFIG.PLANET_ICON_HALF_SIZE * 2}
                      height={ORBIT_CONFIG.PLANET_ICON_HALF_SIZE * 2}
                      x={-ORBIT_CONFIG.PLANET_ICON_HALF_SIZE}
                      y={-ORBIT_CONFIG.PLANET_ICON_HALF_SIZE}
                      className="cursor-pointer"
                      onClick={() =>
                        onSelect?.({
                          type: "planet",
                          planetIndex: pIndex,
                          planetId: planet.id,
                        })
                      }
                    />
                    <text
                      x={0}
                      y={ORBIT_CONFIG.PLANET_ICON_HALF_SIZE + 14}
                      textAnchor="middle"
                      className="fill-white/85 text-xs select-none"
                      onClick={() =>
                        onSelect?.({
                          type: "planet",
                          planetIndex: pIndex,
                          planetId: planet.id,
                        })
                      }
                    >
                      {planet.name}
                    </text>

                    {planet.moons?.map((moon, mIndex) => {
                      const moonOrbitRadius =
                        ORBIT_CONFIG.MOON_ORBIT_RADIUS_BASE +
                        mIndex * ORBIT_CONFIG.MOON_ORBIT_RADIUS_STEP;
                      const baseMoonPeriodSeconds = 6 + mIndex * 2;
                      const moonJitter =
                        (hashToUnitInterval(moon.id || mIndex) - 0.5) * 1.4;
                      const moonPeriodSeconds = Math.max(
                        3,
                        baseMoonPeriodSeconds + moonJitter
                      );
                      const moonAngularVelocity =
                        (Math.PI * 2) / moonPeriodSeconds;
                      const moonPhase =
                        hashToUnitInterval(moon.id || mIndex) * Math.PI * 2;
                      const moonDirection = mIndex % 2 === 0 ? -1 : 1;
                      const moonAngle =
                        moonPhase +
                        moonDirection * moonAngularVelocity * tSeconds;
                      const mx = Math.cos(moonAngle) * moonOrbitRadius;
                      const my = Math.sin(moonAngle) * moonOrbitRadius;

                      const moonSvg = getMoonSvg(mIndex);
                      return (
                        <g key={moon.id || mIndex}>
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
                              width={ORBIT_CONFIG.MOON_ICON_HALF_SIZE * 2}
                              height={ORBIT_CONFIG.MOON_ICON_HALF_SIZE * 2}
                              x={-ORBIT_CONFIG.MOON_ICON_HALF_SIZE}
                              y={-ORBIT_CONFIG.MOON_ICON_HALF_SIZE}
                              className="cursor-pointer"
                              onClick={() =>
                                onSelect?.({
                                  type: "moon",
                                  planetIndex: pIndex,
                                  planetId: planet.id,
                                  moonIndex: mIndex,
                                  moonId: moon.id,
                                })
                              }
                            />
                            <text
                              x={0}
                              y={ORBIT_CONFIG.MOON_ICON_HALF_SIZE + 10}
                              textAnchor="middle"
                              className="fill-white/80 text-[10px] select-none"
                              onClick={() =>
                                onSelect?.({
                                  type: "moon",
                                  planetIndex: pIndex,
                                  planetId: planet.id,
                                  moonIndex: mIndex,
                                  moonId: moon.id,
                                })
                              }
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
        </svg>
      </div>
    </div>
  );
};

export default SystemPreview;
