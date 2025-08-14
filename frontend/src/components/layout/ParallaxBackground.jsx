import React from "react";

function ParallaxBackground({ children }) {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden overflow-y-visible">
      {/* Fixed vibrant dark background */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[#060815] via-[#0b1440] to-[#040611]"
        aria-hidden="true"
      />

      {/* Fixed starfield layers */}
      <div
        className="absolute inset-0 -z-10 opacity-45"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 25px 35px, rgba(255,255,255,0.35), transparent 50%)," +
            "radial-gradient(1px 1px at 75px 125px, rgba(255,255,255,0.25), transparent 50%)," +
            "radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.30), transparent 50%)," +
            "radial-gradient(1.5px 1.5px at 170px 170px, rgba(255,255,255,0.22), transparent 50%)",
          backgroundSize: "200px 200px",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 45px 85px, rgba(255,255,255,0.20), transparent 50%)," +
            "radial-gradient(1px 1px at 95px 165px, rgba(255,255,255,0.18), transparent 50%)," +
            "radial-gradient(1px 1px at 150px 110px, rgba(255,255,255,0.22), transparent 50%)," +
            "radial-gradient(2px 2px at 190px 190px, rgba(255,255,255,0.16), transparent 50%)",
          backgroundSize: "300px 300px",
        }}
        aria-hidden="true"
      />

      {/* Static color wash overlay (no rotation, no oversizing) */}
      <div
        className="absolute inset-0 -z-10 opacity-50 mix-blend-screen"
        style={{
          background:
            "conic-gradient(from 120deg at 30% 20%, rgba(59,130,246,0.28), rgba(56,189,248,0.22) 22%, rgba(251,146,60,0.26) 50%, rgba(245,158,11,0.22) 72%, rgba(59,130,246,0.28))",
        }}
        aria-hidden="true"
      />

      {/* Subtle fixed glow orbs */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 -z-10 w-[620px] h-[620px] rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.32),transparent_60%)] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/3 -right-40 -z-10 w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.30),transparent_60%)] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 -z-10 w-[760px] h-[760px] rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.20),transparent_65%)] blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default ParallaxBackground;
