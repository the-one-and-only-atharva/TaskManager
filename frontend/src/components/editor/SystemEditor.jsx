import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SystemPreview from "./SystemPreview";
import TodoEditor from "./TodoEditor";

const SystemEditor = ({ star, onClose, onSave, onDeleteStar, onRefresh }) => {
  const [name, setName] = useState(star?.name ?? "");
  const [selectedItem, setSelectedItem] = useState(null);
  const [draftStar, setDraftStar] = useState(star);

  useEffect(() => {
    setName(star?.name ?? "");
    setSelectedItem(null);
    setDraftStar(star);
  }, [star?.id]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Handle refresh after deletions
  const handleRefresh = () => {
    // Reset selected item since it might have been deleted
    setSelectedItem(null);

    // Update draft star to match the refreshed star data
    if (star) {
      setDraftStar(star);
    }

    // Notify parent to refresh
    onRefresh?.();
  };

  // Effect to sync draft star with actual star data
  useEffect(() => {
    if (star && draftStar?.id !== star.id) {
      setDraftStar(star);
      setSelectedItem(null);
    }
  }, [star, draftStar?.id]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => onClose?.()}
        />
        <motion.div
          initial={{ y: 20, scale: 0.98, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 10, scale: 0.98, opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="relative z-10 w-[calc(100vw-3rem)] h-[calc(100vh-3rem)] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)] resize overflow-auto rounded-3xl bg-slate-900/40 border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.75)] backdrop-blur-2xl"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="System Editor"
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
            <div className="text-white font-semibold tracking-wide">
              Edit: {star?.name || "Unnamed"}
            </div>
            <button
              onClick={() => onClose?.()}
              className="cursor-pointer px-2 py-1 rounded-2xl text-white/90 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 p-4 h-[calc(100%-56px)] min-h-0">
            <div className="border-r border-white/10 pr-4 min-h-0 overflow-hidden">
              <SystemPreview star={draftStar} onSelect={setSelectedItem} />
            </div>
            <div className="pl-2 min-h-0">
              <TodoEditor
                star={draftStar}
                name={name}
                setName={setName}
                onSave={onSave}
                onClose={onClose}
                onDelete={onDeleteStar}
                selectedItem={selectedItem}
                setStar={setDraftStar}
                onRefresh={handleRefresh}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SystemEditor;
