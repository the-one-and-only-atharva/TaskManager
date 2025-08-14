import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import supernova from "../../assets/supernova.svg";
import saturn from "../../assets/saturn.svg";
import moon from "../../assets/moon.svg";

function OrbitalVisual({ onSelect, selectedType }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative isolate w-full aspect-square max-h-[480px] mx-auto">

      {/* Center star (goal) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center">
        <button
          type="button"
          onClick={() => onSelect?.("star")}
          aria-label="View details for Stars (Goals)"
          className={`cursor-pointer appearance-none bg-transparent p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-300/80 focus:ring-offset-2 ${
            selectedType === "star"
              ? "ring-2 ring-yellow-300/80 ring-offset-2"
              : ""
          }`}
        >
          <img
            src={supernova}
            alt=""
            className="h-24 w-24 drop-shadow-[0_0_22px_rgba(251,226,89,0.6)]"
            loading="lazy"
            decoding="async"
            width={64}
            height={64}
          />
        </button>
      </div>

      {/* Planet orbit (projects) with nested moon orbit (tasks) */}
      <motion.div
        className="absolute inset-0 z-20"
        animate={prefersReducedMotion ? undefined : { rotate: 360 }}
        transition={
          prefersReducedMotion
            ? undefined
            : { repeat: Infinity, ease: "linear", duration: 28 }
        }
        style={{ transformOrigin: "50% 50%" }}
      >
        <div className="absolute left-1/2 top-6 -translate-x-1/2 z-40">
          <div className="relative inline-block z-40">
            <button
              type="button"
              onClick={() => onSelect?.("planet")}
              aria-label="View details for Planets (Projects)"
              className={`relative z-50 cursor-pointer pointer-events-auto appearance-none bg-transparent p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-300/80 focus:ring-offset-2 ${
                selectedType === "planet"
                  ? "ring-2 ring-sky-300/80 ring-offset-2"
                  : ""
              }`}
            >
              <img
                src={saturn}
                alt=""
                className="h-12 w-12 drop-shadow-[0_0_16px_rgba(59,130,246,0.5)]"
                loading="lazy"
                decoding="async"
                width={48}
                height={48}
              />
            </button>
            {/* Moon orbits the planet */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24"
              animate={prefersReducedMotion ? undefined : { rotate: -360 }}
              transition={
                prefersReducedMotion
                  ? undefined
                  : { repeat: Infinity, ease: "linear", duration: 8 }
              }
              style={{ transformOrigin: "50% 50%" }}
            >
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-50">
                <button
                  type="button"
                  onClick={() => onSelect?.("moon")}
                  aria-label="View details for Moons (Tasks)"
                  className={`relative z-50 cursor-pointer pointer-events-auto appearance-none bg-transparent p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-300/80 focus:ring-offset-2 ${
                    selectedType === "moon"
                      ? "ring-2 ring-slate-300/80 ring-offset-2"
                      : ""
                  }`}
                >
                  <img
                    src={moon}
                    alt=""
                    className="h-6 w-6 drop-shadow-[0_0_10px_rgba(163,180,190,0.45)]"
                    loading="lazy"
                    decoding="async"
                    width={12}
                    height={12}
                  />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Soft gradient glows */}
      <div className="pointer-events-none absolute -z-10 inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.18),transparent_60%)] blur-2xl" />
      <div className="pointer-events-none absolute -z-10 inset-10 rounded-full bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.16),transparent_60%)] blur-2xl" />
    </div>
  );
}

export default OrbitalVisual;
