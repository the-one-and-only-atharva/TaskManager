import React from "react";

const RiskSection = ({ selectedPlanet, setPlanetField }) => {
  return (
    <>
      <h3 className="text-white/90 text-lg font-semibold">Risk Management</h3>

      <div>
        <div className="text-white/90 font-medium ml-2 mb-2">Risk Level</div>
        <div className="grid grid-cols-3 gap-2">
          {[
            {
              key: "low",
              label: "Low",
              color: "bg-green-500/40 border-green-400/30",
            },
            {
              key: "medium",
              label: "Medium",
              color: "bg-yellow-500/40 border-yellow-400/30",
            },
            {
              key: "high",
              label: "High",
              color: "bg-red-500/40 border-red-400/30",
            },
          ].map((risk) => (
            <button
              key={risk.key}
              type="button"
              onClick={() => setPlanetField("riskLevel", risk.key)}
              className={`cursor-pointer px-3 py-2 rounded-lg border text-sm transition-all duration-200 ${
                selectedPlanet?.riskLevel === risk.key
                  ? `${risk.color} text-white scale-105`
                  : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 hover:scale-102"
              }`}
            >
              {risk.label}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="text-white/90 text-sm">Risk Factors</span>
        <textarea
          className="mt-1 w-full rounded-lg bg-white/10 border border-white/10 text-white px-3 py-2 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
          rows="3"
          value={selectedPlanet?.riskFactors || ""}
          onChange={(e) => setPlanetField("riskFactors", e.target.value)}
          placeholder="Describe potential risks..."
        />
      </label>

      <label className="block">
        <span className="text-white/90 text-sm">Mitigation Strategy</span>
        <textarea
          className="mt-1 w-full rounded-lg bg-white/10 border border-white/10 text-white px-3 py-2 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
          rows="3"
          value={selectedPlanet?.mitigation || ""}
          onChange={(e) => setPlanetField("mitigation", e.target.value)}
          placeholder="How to address these risks..."
        />
      </label>
    </>
  );
};

export default RiskSection;
