import React from "react";

const ArrangeSection = ({ reorderPlanet }) => {
  return (
    <>
      <h3 className="text-white/90 text-lg font-semibold">
        System Arrangement
      </h3>

      <div>
        <div className="text-white/90 font-medium ml-2">Orbit Position</div>
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => reorderPlanet("inward")}
            className="cursor-pointer px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 text-white hover:bg-white/15 transition-colors hover:scale-105"
          >
            Move inward
          </button>
          <button
            type="button"
            onClick={() => reorderPlanet("outward")}
            className="cursor-pointer px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 text-white hover:bg-white/15 transition-colors hover:scale-105"
          >
            Move outward
          </button>
        </div>
      </div>
    </>
  );
};

export default ArrangeSection;
