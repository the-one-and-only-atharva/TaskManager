import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ParallaxBackground from "../layout/ParallaxBackground";
import StarMap from "./StarMap";
import SystemEditor from "../editor/SystemEditor";
import { useDialog } from "../common/DialogProvider";
import { generateId, supernovaSvg, ORBIT_CONFIG } from "../../constants/space";
import { resolveNonOverlapPosition } from "../../utils/orbit";

// SVG Icons for menu
import saturnSvg from "../../assets/saturn.svg";
import moonSvg from "../../assets/moon.svg";

const Canvas = () => {
  const [stars, setStars] = useState([]);
  const [activeStarId, setActiveStarId] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { alert, prompt, select } = useDialog();
  const starMapRef = useRef(null);

  const addStar = async () => {
    const name = await prompt({
      title: "Add Star",
      label: "Star name",
      placeholder: "Sirius",
    });
    if (!name) return;
    setStars((prev) => {
      const id = generateId();
      const center = starMapRef.current?.getWorldCenter?.();
      const initial = {
        id,
        name,
        x: center?.x ?? 480,
        y: center?.y ?? 380,
        planets: [],
      };
      const { x, y } = resolveNonOverlapPosition(
        initial,
        prev,
        initial.x,
        initial.y
      );
      return [...prev, { ...initial, x, y }];
    });
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

    setStars((prev) => {
      const copy = [...prev];
      const star = { ...copy[starIndex] };
      star.planets = [
        ...star.planets,
        { id: generateId(), name: planetName, moons: [] },
      ];
      // After radius increases, nudge to resolve overlaps
      const others = copy.filter((s) => s.id !== star.id);
      const { x, y } = resolveNonOverlapPosition(star, others, star.x, star.y);
      star.x = x;
      star.y = y;
      copy[starIndex] = star;
      return copy;
    });
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

    setStars((prev) => {
      const copy = prev.map((s) => ({ ...s }));
      const star = copy.find((s) => s.id === target.starId);
      const pIndex = star.planets.findIndex((p) => p.name === target.name);
      const planet = { ...star.planets[pIndex] };
      planet.moons = [
        ...planet.moons,
        { id: generateId(), name: moonName, todos: [] },
      ];
      star.planets = star.planets.map((p, i) => (i === pIndex ? planet : p));
      // Resolve overlaps since this system radius may have grown
      const others = copy.filter((s) => s.id !== star.id);
      const { x, y } = resolveNonOverlapPosition(star, others, star.x, star.y);
      star.x = x;
      star.y = y;
      return copy;
    });
  };

  const onStarPositionChange = (starId, x, y) => {
    setStars((prev) => prev.map((s) => (s.id === starId ? { ...s, x, y } : s)));
  };

  const openEditorForStar = (star) => {
    setActiveStarId(star.id);
  };

  const closeEditor = () => setActiveStarId(null);

  const handleSaveStar = (updatedStar) => {
    setStars((prev) =>
      prev.map((s) => (s.id === updatedStar.id ? { ...s, ...updatedStar } : s))
    );
    setActiveStarId(null);
  };

  const handleDeleteStar = (starId) => {
    setStars((prev) => prev.filter((s) => s.id !== starId));
    setActiveStarId(null);
  };

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
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        onClick={() => {
                          addStar();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg bg-yellow-400/30 text-yellow-200 hover:bg-yellow-400/70 transition text-left w-36"
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
                        className="flex items-center gap-3 px-3 py-2 rounded-lg bg-sky-400/30 text-sky-200 hover:bg-sky-400/70 transition text-left w-36"
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
        />
      )}
    </>
  );
};

export default Canvas;
