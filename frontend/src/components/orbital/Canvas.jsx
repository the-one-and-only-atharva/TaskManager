import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ParallaxBackground from "../layout/ParallaxBackground";
import StarMap from "./StarMap";
import SystemEditor from "../editor/SystemEditor";
import { useDialog } from "../common/DialogProvider";
import { generateId, supernovaSvg, ORBIT_CONFIG } from "../../constants/space";
import { resolveNonOverlapPosition } from "../../utils/orbit";
import { apiFetch } from "../../lib/api.js";

// SVG Icons for menu
import saturnSvg from "../../assets/saturn.svg";
import moonSvg from "../../assets/moon.svg";

const Canvas = () => {
  const [stars, setStars] = useState([]);
  const [activeStarId, setActiveStarId] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { alert, prompt, select } = useDialog();
  const starMapRef = useRef(null);

  // Function to refresh stars data from API
  const refreshStars = async () => {
    try {
      setIsRefreshing(true);
      const resp = await apiFetch("/api/stars");
      setStars(resp?.data || []);
    } catch (err) {
      console.error("Failed to refresh stars:", err);
      // Keep existing stars on refresh failure
    } finally {
      setIsRefreshing(false);
    }
  };

  const addStar = async () => {
    const name = await prompt({
      title: "Add Star",
      label: "Star name",
      placeholder: "Sirius",
    });
    if (!name) return;
    try {
      // Compute a non-overlapping position before creating it on the server
      const center = starMapRef.current?.getWorldCenter?.();
      const draft = {
        id: generateId(),
        name,
        x: center?.x ?? 480,
        y: center?.y ?? 380,
        planets: [],
      };
      setStars((prev) => prev); // no-op to ensure latest state captured in closure below
      const { x, y } = resolveNonOverlapPosition(
        draft,
        stars,
        draft.x,
        draft.y
      );

      const resp = await apiFetch("/api/stars", {
        method: "POST",
        body: JSON.stringify({ name, x, y, priority: "medium" }),
      });
      const created = resp?.data;
      if (!created) return;
      setStars((prev) => [...prev, created]);
    } catch (err) {
      await alert(
        err?.message || "Failed to create star. Please sign in and try again."
      );
    }
  };

  const addPlanet = async () => {
    if (stars.length === 0) {
      await alert("Please add a star first.");
      return;
    }

    // Show star selection dropdown
    const starItems = stars.map((star) => ({
      label: star.name,
      value: star.name,
    }));
    const selectedStarName = await select({
      title: "Add Planet",
      label: "Select the star this planet will orbit:",
      items: starItems,
      confirmText: "Next",
    });
    if (!selectedStarName) return;

    const starIndex = stars.findIndex((s) => s.name === selectedStarName);
    if (starIndex === -1) {
      await alert("Star not found.");
      return;
    }

    // Get planet name
    const planetName = await prompt({
      title: "Add Planet",
      label: "Planet name",
      placeholder: "Europa",
    });
    if (!planetName) return;
    try {
      const targetStar = stars[starIndex];
      const resp = await apiFetch("/api/planets", {
        method: "POST",
        body: JSON.stringify({ star_id: targetStar.id, name: planetName }),
      });
      const created = resp?.data;
      if (!created) return;

      setStars((prev) => {
        const copy = [...prev];
        const star = { ...copy[starIndex] };
        star.planets = [...(star.planets || []), created];
        // After radius increases, nudge to resolve overlaps, and persist new position if changed
        const others = copy.filter((s) => s.id !== star.id);
        const { x, y } = resolveNonOverlapPosition(
          star,
          others,
          star.x,
          star.y
        );
        if (x !== star.x || y !== star.y) {
          star.x = x;
          star.y = y;
          // Fire-and-forget position update
          apiFetch(`/api/stars/${star.id}`, {
            method: "PUT",
            body: JSON.stringify({ x, y }),
          }).catch(() => {});
        }
        copy[starIndex] = star;
        return copy;
      });
    } catch (err) {
      await alert(err?.message || "Failed to create planet.");
    }
  };

  const addMoon = async () => {
    const allPlanets = stars.flatMap((s) =>
      s.planets.map((p) => ({ ...p, starId: s.id, starName: s.name }))
    );
    if (allPlanets.length === 0) {
      await alert("Please add a planet first.");
      return;
    }

    // Show planet selection dropdown
    const planetItems = allPlanets.map((planet) => ({
      label: `${planet.name} (orbits ${planet.starName})`,
      value: planet.name,
    }));
    const selectedPlanetName = await select({
      title: "Add Moon",
      label: "Select the planet this moon will orbit:",
      items: planetItems,
      confirmText: "Next",
    });
    if (!selectedPlanetName) return;

    const target = allPlanets.find((p) => p.name === selectedPlanetName);
    if (!target) {
      await alert("Planet not found.");
      return;
    }

    // Get moon name
    const moonName = await prompt({
      title: "Add Moon",
      label: "Moon name",
      placeholder: "Ganymede",
    });
    if (!moonName) return;
    try {
      // Find the actual planet object to obtain its id
      const parentStarIndex = stars.findIndex((s) => s.id === target.starId);
      if (parentStarIndex === -1) {
        await alert("Star not found.");
        return;
      }
      const parentStar = stars[parentStarIndex];
      const planet = parentStar.planets.find((p) => p.name === target.name);
      if (!planet) {
        await alert("Planet not found.");
        return;
      }

      const resp = await apiFetch("/api/moons", {
        method: "POST",
        body: JSON.stringify({ planet_id: planet.id, name: moonName }),
      });
      const created = resp?.data;
      if (!created) return;

      setStars((prev) => {
        const copy = prev.map((s) => ({ ...s }));
        const star = copy[parentStarIndex];
        const pIndex = star.planets.findIndex((p) => p.id === planet.id);
        const pCopy = { ...star.planets[pIndex] };
        pCopy.moons = [...(pCopy.moons || []), created];
        star.planets = star.planets.map((p, i) => (i === pIndex ? pCopy : p));
        return copy;
      });
    } catch (err) {
      await alert(err?.message || "Failed to create moon.");
    }
  };

  const onStarPositionChange = (starId, x, y) => {
    setStars((prev) => prev.map((s) => (s.id === starId ? { ...s, x, y } : s)));
    // Persist position update (best-effort)
    apiFetch(`/api/stars/${starId}`, {
      method: "PUT",
      body: JSON.stringify({ x, y }),
    }).catch(() => {});
  };

  const openEditorForStar = (star) => {
    setActiveStarId(star.id);
  };

  const closeEditor = () => setActiveStarId(null);

  const handleSaveStar = async (updatedStar) => {
    try {
      const resp = await apiFetch(`/api/stars/${updatedStar.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: updatedStar.name,
          priority: updatedStar.priority,
          x: updatedStar.x,
          y: updatedStar.y,
        }),
      });
      const saved = resp?.data ?? updatedStar;
      setStars((prev) =>
        prev.map((s) => (s.id === saved.id ? { ...s, ...saved } : s))
      );
      setActiveStarId(null);
    } catch (err) {
      await alert(err?.message || "Failed to save star changes.");
    }
  };

  const handleDeleteStar = async (starId) => {
    try {
      await apiFetch(`/api/stars/${starId}`, { method: "DELETE" });
      setStars((prev) => prev.filter((s) => s.id !== starId));
      setActiveStarId(null);
    } catch (err) {
      await alert(err?.message || "Failed to delete star.");
    }
  };

  // Load existing stars from API on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const resp = await apiFetch("/api/stars");
        if (!cancelled) setStars(resp?.data || []);
      } catch (err) {
        // ignore errors here; Canvas can still be used for local drafting
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <ParallaxBackground>
        <div>
          <div>
            <StarMap
              ref={starMapRef}
              stars={stars}
              onStarPositionChange={onStarPositionChange}
              onStarClick={openEditorForStar}
            />
            <div className="absolute top-5 left-9 z-10">
              {/* Animated Hamburger Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-3 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xl hover:bg-white/15 transition-all duration-200 group"
                aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
              >
                <div className="w-6 h-6 relative flex flex-col justify-center items-center">
                  {/* Top Line */}
                  <motion.div
                    className="w-6 h-0.5 bg-white absolute"
                    initial={false}
                    animate={
                      isMenuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }
                    }
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                  {/* Middle Line */}
                  <motion.div
                    className="w-6 h-0.5 bg-white absolute"
                    initial={false}
                    animate={
                      isMenuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }
                    }
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                  {/* Bottom Line */}
                  <motion.div
                    className="w-6 h-0.5 bg-white absolute"
                    initial={false}
                    animate={
                      isMenuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }
                    }
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                </div>
              </button>

              {/* Animated Menu Panel */}
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="mt-3 w-45 bg-white/10 backdrop-blur-3xl rounded-2xl p-4 border border-white/10 shadow-lg"
                  >
                    <div className="text-white text-lg font-semibold mb-3">
                      Menu
                    </div>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          addStar();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg bg-yellow-400/50 text-yellow-200 hover:bg-yellow-400/90 transition text-left w-36"
                      >
                        <img
                          src={supernovaSvg}
                          alt="Star"
                          className="w-5 h-5"
                        />
                        Add Star
                      </button>
                      <button
                        onClick={() => {
                          addPlanet();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg bg-sky-400/50 text-sky-200 hover:bg-sky-400/90 transition text-left w-36"
                      >
                        <img src={saturnSvg} alt="Planet" className="w-5 h-5" />
                        Add Planet
                      </button>
                      <button
                        onClick={() => {
                          addMoon();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-400/50 text-slate-200 hover:bg-slate-400/90 transition text-left w-36"
                      >
                        <img src={moonSvg} alt="Moon" className="w-5 h-5" />
                        Add Moon
                      </button>
                      <button
                        onClick={() => {
                          refreshStars();
                          setIsMenuOpen(false);
                        }}
                        disabled={isRefreshing}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg bg-emerald-400/50 text-emerald-200 hover:bg-emerald-400/90 transition text-left w-36 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isRefreshing ? (
                          <div className="w-5 h-5 border-2 border-current border-r-transparent rounded-full animate-spin" />
                        ) : (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                        )}
                        {isRefreshing ? "Refreshing..." : "Refresh"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </ParallaxBackground>
      {activeStarId && (
        <SystemEditor
          star={stars.find((s) => s.id === activeStarId)}
          onClose={closeEditor}
          onSave={handleSaveStar}
          onDeleteStar={handleDeleteStar}
          onRefresh={refreshStars}
        />
      )}
    </>
  );
};

export default Canvas;
