import React, { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { containerStagger, fadeInUpItem } from "../ui/variants";
import OrbitalVisual from "../orbital/OrbitalVisual";

const MotionLink = motion.create(Link);

const containerVariants = containerStagger;
const itemVariants = fadeInUpItem;

function HeroSection() {
  const [selectedType, setSelectedType] = useState("star");

  const handleStartClick = useCallback(() => {
    document
      .getElementById("hierarchy-section")
      ?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const detailsByType = {
    star: {
      title: "Stars",
      colorClass: "text-yellow-300",
      badgeClass: "bg-yellow-300/10 text-yellow-200 border-yellow-300/20",
      description:
        "Your major life goals shine brightest. These are your central ambitions that guide everything else.",
      examples: ["Launch a Company", "Learn Piano", "Write a Book"],
    },
    planet: {
      title: "Planets",
      colorClass: "text-sky-300",
      badgeClass: "bg-sky-300/10 text-sky-200 border-sky-300/20",
      description:
        "Significant projects and milestones orbit your stars. Each planet represents a major step toward your goals.",
      examples: ["Develop Business Plan", "Master Music Theory"],
    },
    moon: {
      title: "Moons",
      colorClass: "text-slate-200",
      badgeClass: "bg-slate-200/10 text-slate-100 border-slate-200/20",
      description:
        "Daily actionable tasks orbit your planets. These are the small steps that build your universe.",
      examples: ["Research competitors", "Practice scales for 20 mins"],
    },
  };
  const details = detailsByType[selectedType];
  return (
    <motion.section
      className="relative max-w-7xl mx-auto px-6 sm:px-8 pt-28 pb-20 lg:py-28 min-h-[86vh] flex items-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      role="region"
      aria-labelledby="hero-title"
      id="hero-section"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        {/* Left: Content */}
        <div className="-mt-20">
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-[10px] font-bold text-white">
              NEW
            </span>
            Galaxy-grade productivity, now in beta
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white"
            id="hero-title"
          >
            TaskManager
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-fuchsia-400 to-fuchsia-700">
              Organize.
            </span>
            <span className="block lg:ml-20 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-yellow-300 to-amber-400">
              Prioritize.
            </span>
            <span className="block lg:ml-40 text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-red-600 to-red-700">
              Achieve.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-5 text-base sm:text-lg text-white/80 max-w-2xl"
          >
            Bring clarity to chaos with a beautifully minimal task system.
            Create projects, set priorities, and watch your workflow orbit into
            focus.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-col sm:flex-row gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer px-6 py-3 rounded-xl bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-400 text-white font-semibold shadow-lg shadow-sky-900/30 hover:shadow-xl transition-all duration-300"
              onClick={handleStartClick}
              type="button"
              aria-label="Start free and scroll to hierarchy section"
            >
              Learn More
            </motion.button>

            <MotionLink
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer px-6 py-3 rounded-xl bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-400 text-white font-semibold shadow-lg shadow-sky-900/30 hover:shadow-xl transition-all duration-300"
              to="/canvas"
              type="button"
              aria-label="Navigate to the Canvas"
            >
              Get Started
            </MotionLink>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-6 flex items-center gap-4 text-white/70"
          >
            <div className="flex items-center" aria-label="5 out of 5 rating">
              {Array.from({ length: 5 }).map((_, index) => (
                <svg
                  key={index}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5 text-amber-400"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm">Loved by 1,200+ makers and teams</span>
          </motion.div>
          <motion.p
            variants={itemVariants}
            className="mt-2 text-xs text-white/60"
          >
            No credit card required · 14-day free trial
          </motion.p>
        </div>

        {/* Right: Product Visual - Orbital hierarchy */}
        <div className="relative z-10 isolate">
          <motion.div
            variants={itemVariants}
            className="-mt-20 relative mx-auto w-full max-w-[560px] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl overflow-hidden p-6"
          >
            <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.35),transparent_60%)] blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-16 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.30),transparent_60%)] blur-2xl" />
            <div>
              <OrbitalVisual
                onSelect={setSelectedType}
                selectedType={selectedType}
              />
            </div>
            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xl border ${details.badgeClass}`}
                >
                  {details.title}
                </span>
                <span className={`${details.colorClass} text-xl`}>Details</span>
              </div>
              <p className="text-lg text-white/80">{details.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {details.examples.map((ex) => (
                  <span
                    key={ex}
                    className="text-md cursor-default text-white/70 bg-white/5 border border-white/10 rounded-full px-2 py-0.5 hover:scale-105 hover:bg-white/80 hover:text-black transition-all duration-150"
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

export default HeroSection;
