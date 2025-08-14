import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const PlanningSection = ({
  selectedPlanet,
  setPlanetField,
  toggleDependency,
  otherPlanets,
  addMilestone,
  removeMilestone,
  newMilestoneName,
  setNewMilestoneName,
  newMilestoneDue,
  setNewMilestoneDue,
}) => {
  return (
    <>
      <h3 className="text-white/90 text-lg font-semibold">
        Planning & Timeline
      </h3>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-white/90 text-sm">Start Date</span>
          <input
            type="date"
            className="mt-1 w-full rounded-lg bg-white/10 border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/30"
            value={selectedPlanet?.startDate || ""}
            onChange={(e) => setPlanetField("startDate", e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-white/90 text-sm">Due Date</span>
          <input
            type="date"
            className="mt-1 w-full rounded-lg bg-white/10 border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/30"
            value={selectedPlanet?.dueDate || ""}
            onChange={(e) => setPlanetField("dueDate", e.target.value)}
          />
        </label>
      </div>

      {/* Estimated Time */}
      <label className="block">
        <span className="text-white/90 text-sm">Estimated Time</span>
        <input
          className="mt-1 w-full rounded-lg bg-white/10 border border-white/10 text-white px-3 py-2 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
          value={selectedPlanet?.estimatedTime || ""}
          onChange={(e) => setPlanetField("estimatedTime", e.target.value)}
          placeholder="e.g., 2 weeks, 3 hours"
        />
      </label>

      {/* Dependencies */}
      <div>
        <div className="text-white/90 font-medium ml-2 mb-2">Dependencies</div>
        <div className="space-y-2">
          {otherPlanets.map(({ p, idx }) => {
            if (p.id === selectedPlanet?.id) return null;
            const checked = (selectedPlanet?.dependencies ?? []).includes(p.id);
            return (
              <label
                key={p.id}
                className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleDependency(p.id)}
                  className="accent-sky-400"
                />
                <span className="text-white/80">{p.name}</span>
              </label>
            );
          })}
          {otherPlanets.length <= 1 && (
            <div className="text-white/50 text-sm ml-2">
              No other planets available
            </div>
          )}
        </div>
      </div>

      {/* Milestones */}
      <div>
        <div className="text-white/90 font-medium ml-2 mb-2">Milestones</div>
        <div className="space-y-2">
          <AnimatePresence>
            {(selectedPlanet?.milestones || []).map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2"
              >
                <div className="flex-1">
                  <div className="text-white">{m.name}</div>
                  {m.due && (
                    <div className="text-white/60 text-xs">Due: {m.due}</div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeMilestone(m.id)}
                  className="cursor-pointer px-2 py-1 rounded-md bg-red-500/20 text-red-100 border border-red-400/30 hover:bg-red-500/30 transition-colors"
                >
                  Remove
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="grid grid-cols-5 gap-2">
            <input
              className="col-span-3 rounded-lg bg-white/10 border border-white/10 text-white px-3 py-2 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Milestone name"
              value={newMilestoneName}
              onChange={(e) => setNewMilestoneName(e.target.value)}
            />
            <input
              type="date"
              className="col-span-2 rounded-lg bg-white/10 border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/30"
              value={newMilestoneDue}
              onChange={(e) => setNewMilestoneDue(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={addMilestone}
              className="cursor-pointer rounded-lg bg-white/10 border border-white/10 text-white px-3 py-2 hover:bg-white/15 transition-colors"
            >
              Add Milestone
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlanningSection;
