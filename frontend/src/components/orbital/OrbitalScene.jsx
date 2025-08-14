import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import supernova from "../assets/supernova.svg";
import saturn from "../assets/saturn.svg";
import moon from "../assets/moon.svg";

export default function OrbitalScene({ star }) {
  const prefersReducedMotion = useReducedMotion();

  const planetRadii = useMemo(
    () => star.planets.map((_, index) => 90 + index * 72),
    [star.planets]
  );

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]">
      <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <img
          src={supernova}
          alt="Star goal"
          className="h-28 w-28 drop-shadow-[0_0_28px_rgba(251,226,89,0.6)]"
          loading="lazy"
          decoding="async"
        />
        <div className="mt-2 text-center text-white/90 text-lg font-semibold max-w-[260px] truncate">
          {star.title}
        </div>
      </div>

      {star.planets.map((planet, index) => {
        const radius = planetRadii[index];
        const duration = 24 + index * 6;
        const reverse = index % 2 === 1;
        return (
          <motion.div
            key={planet.id}
            className="absolute inset-0"
            style={{ transformOrigin: "50% 50%" }}
            animate={
              prefersReducedMotion
                ? undefined
                : { rotate: reverse ? -360 : 360 }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : { repeat: Infinity, ease: "linear", duration }
            }
          >
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
              style={{ width: radius * 2, height: radius * 2 }}
              aria-hidden="true"
            />

            <div
              className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
              style={{
                transform: `translate(-50%, -50%) translateY(-${radius}px)`,
              }}
            >
              <div className="relative">
                <img
                  src={saturn}
                  alt="Planet project"
                  className="h-12 w-12 drop-shadow-[0_0_18px_rgba(59,130,246,0.55)]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute left-1/2 top-12 -translate-x-1/2 text-center text-white/85 text-sm whitespace-nowrap max-w-[160px] truncate">
                  {planet.title}
                </div>
              </div>

              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ width: 88, height: 88, transformOrigin: "50% 50%" }}
                animate={
                  prefersReducedMotion
                    ? undefined
                    : { rotate: reverse ? 360 : -360 }
                }
                transition={
                  prefersReducedMotion
                    ? undefined
                    : {
                        repeat: Infinity,
                        ease: "linear",
                        duration: 8 + index * 2,
                      }
                }
              >
                <div className="absolute -right-3 top-1/2 -translate-y-1/2">
                  <img
                    src={moon}
                    alt="Moon tasks"
                    className="h-6 w-6 drop-shadow-[0_0_10px_rgba(163,180,190,0.45)]"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        );
      })}

      <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.18),transparent_60%)] blur-2xl" />
      <div className="pointer-events-none absolute inset-6 -z-10 rounded-full bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.16),transparent_60%)] blur-2xl" />
    </div>
  );
}
