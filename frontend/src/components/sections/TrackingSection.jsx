import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const TrackingSection = ({
  selectedPlanet,
  setPlanetField,
  tagsString,
  onTagsChange,
  addOutcome,
  removeOutcome,
  newOutcomeLabel,
  setNewOutcomeLabel,
  newOutcomeTarget,
  setNewOutcomeTarget,
  addLink,
  removeLink,
  newLinkTitle,
  setNewLinkTitle,
  newLinkUrl,
  setNewLinkUrl,
}) => {
  return (
    <>
      <h3 className="text-white/90 text-lg font-semibold">
        Tracking & Documentation
      </h3>

      {/* Notes */}
      <label className="block">
        <span className="text-white/90 text-sm">Notes</span>
        <textarea
          className="mt-1 w-full rounded-lg bg-white/10 border border-white/10 text-white px-3 py-2 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
          rows="4"
          value={selectedPlanet?.notes || ""}
          onChange={(e) => setPlanetField("notes", e.target.value)}
          placeholder="Additional notes..."
        />
      </label>

      {/* Tags */}
      <label className="block">
        <span className="text-white/90 text-sm">Tags (comma-separated)</span>
        <input
          className="mt-1 w-full rounded-lg bg-white/10 border border-white/10 text-white px-3 py-2 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
          value={tagsString}
          onChange={(e) => onTagsChange(e.target.value)}
          placeholder="e.g., frontend, backend, urgent"
        />
      </label>

      {/* Outcomes */}
      <div>
        <div className="text-white/90 font-medium ml-2 mb-2">Outcomes</div>
        <div className="space-y-2">
          <AnimatePresence>
            {(selectedPlanet?.outcomes || []).map((o) => (
              <motion.div
                key={o.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2"
              >
                <div className="flex-1">
                  <div className="text-white">{o.label}</div>
                  {o.target && (
                    <div className="text-white/60 text-xs">
                      Target: {o.target}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeOutcome(o.id)}
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
              placeholder="Outcome"
              value={newOutcomeLabel}
              onChange={(e) => setNewOutcomeLabel(e.target.value)}
            />
            <input
              className="col-span-2 rounded-lg bg-white/10 border border-white/10 text-white px-3 py-2 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Target (optional)"
              value={newOutcomeTarget}
              onChange={(e) => setNewOutcomeTarget(e.target.value)}
            />
            <button type="button" onClick={addOutcome} className="hidden">
              Add
            </button>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={addOutcome}
              className="cursor-pointer rounded-lg bg-white/10 border border-white/10 text-white px-3 py-2 hover:bg-white/15 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Links */}
      <div>
        <div className="text-white/90 font-medium ml-2 mb-2">Links</div>
        <div className="space-y-2">
          {(selectedPlanet?.links || []).map((l) => (
            <motion.div
              key={l.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2"
            >
              <a
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="text-sky-300 hover:underline flex-1 truncate"
                title={l.url}
              >
                {l.title || l.url}
              </a>
              <button
                type="button"
                onClick={() => removeLink(l.id)}
                className="cursor-pointer px-2 py-1 rounded-md bg-red-500/20 text-red-100 border border-red-400/30 hover:bg-red-500/30 transition-colors"
              >
                Remove
              </button>
            </motion.div>
          ))}
          <div className="grid grid-cols-5 gap-2">
            <input
              className="col-span-2 rounded-lg bg-white/10 border border-white/10 text-white px-3 py-2 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Title (optional)"
              value={newLinkTitle}
              onChange={(e) => setNewLinkTitle(e.target.value)}
            />
            <input
              className="col-span-3 rounded-lg bg-white/10 border border-white/10 text-white px-3 py-2 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="https://..."
              value={newLinkUrl}
              onChange={(e) => setNewLinkUrl(e.target.value)}
            />
            <button type="button" onClick={addLink} className="hidden">
              Add
            </button>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={addLink}
              className="cursor-pointer rounded-lg bg-white/10 border border-white/10 text-white px-3 py-2 hover:bg-white/15 transition-colors"
            >
              Add Link
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrackingSection;
