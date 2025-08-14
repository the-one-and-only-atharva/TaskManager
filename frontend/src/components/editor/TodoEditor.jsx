import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlanetManagement } from "../../hooks/usePlanetManagement";
import { useMoonManagement } from "../../hooks/useMoonManagement";
import { useSectionManagement } from "../../hooks/useSectionManagement";
import PrioritySelector from "../todo/PrioritySelector";
import StatusSelector from "../todo/StatusSelector";
import PlanningSection from "../sections/PlanningSection";
import RiskSection from "../sections/RiskSection";
import TrackingSection from "../sections/TrackingSection";
import ArrangeSection from "../sections/ArrangeSection";
import TodoInput from "../todo/TodoInput";
import TodoList from "../todo/TodoList";
import TodoStats from "../todo/TodoStats";
import { getMoonSvg, getPlanetSvg } from "../../constants/space";

const TodoEditor = ({
  star,
  name,
  setName,
  onSave,
  onClose,
  onDelete,
  selectedItem,
  setStar,
}) => {
  // Use custom hooks
  const planetManagement = usePlanetManagement(star, selectedItem, setStar);
  const moonManagement = useMoonManagement(star, selectedItem, setStar);
  const sectionManagement = useSectionManagement();

  const {
    selectedPlanet,
    setPlanetField,
    setStarField,
    reorderPlanet,
    toggleDependency,
    otherPlanets,
    addOutcome,
    removeOutcome,
    newOutcomeLabel,
    setNewOutcomeLabel,
    newOutcomeTarget,
    setNewOutcomeTarget,
    addMilestone,
    removeMilestone,
    newMilestoneName,
    setNewMilestoneName,
    newMilestoneDue,
    setNewMilestoneDue,
    addLink,
    removeLink,
    newLinkTitle,
    setNewLinkTitle,
    newLinkUrl,
    setNewLinkUrl,
    tagsString,
    onTagsChange,
  } = planetManagement;

  const {
    showPlanning,
    showRisk,
    showTracking,
    showArrange,
    editorScrollRef,
    planningRef,
    riskRef,
    trackingRef,
    arrangeRef,
    handleSectionAnimationComplete,
    openSection,
  } = sectionManagement;

  return (
    <div className="w-full h-full flex flex-col">
      <div
        className="flex-1 overflow-auto pr-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30"
        ref={editorScrollRef}
      >
        <div className="space-y-4">
          {!selectedItem && (
            <label className="block">
              <span className="text-white/90 text-3xl">Edit System Name</span>
              <input
                className="mt-5 w-full rounded-xl bg-white/10 border border-white/10 text-white px-3 py-2 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="System Name"
              />
            </label>
          )}
          {!selectedItem && (
            <div className="mt-6 p-6 rounded-2xl bg-white/5 border border-white/10">
              <PrioritySelector
                value={star?.priority}
                onChange={(value) => setStarField("priority", value)}
              />
            </div>
          )}
          {selectedItem?.type === "planet" && (
            <div className="space-y-3">
              {/* Header with planet name */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 opacity-80">
                    <img
                      src={getPlanetSvg(selectedItem?.planetIndex || 0)}
                      alt="Planet"
                      className="w-full h-full filter drop-shadow-lg"
                    />
                  </div>
                  <div className="text-white/90 font-medium text-3xl">
                    Editing Planet: {selectedPlanet?.name}
                  </div>
                </div>
                {/* Basic Info */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  {/* Title */}
                  <label className="block mb-4">
                    <span className="text-white/90 text-sm">Title</span>
                    <input
                      className="mt-1 w-full rounded-lg bg-white/10 border border-white/10 text-white px-3 py-2 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                      value={selectedPlanet?.name || ""}
                      onChange={(e) => setPlanetField("name", e.target.value)}
                      placeholder="Planet Title"
                    />
                  </label>

                  {/* Description */}
                  <label className="block">
                    <span className="text-white/90 text-sm">Description</span>
                    <textarea
                      className="mt-1 w-full rounded-lg bg-white/10 border border-white/10 text-white px-3 py-2 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
                      rows="3"
                      value={selectedPlanet?.description || ""}
                      onChange={(e) =>
                        setPlanetField("description", e.target.value)
                      }
                      placeholder="What is this about?"
                    />
                  </label>
                </div>

                {/* Priority and Status */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    {/* Priority */}
                    <PrioritySelector
                      value={selectedPlanet?.priority}
                      onChange={(value) => setPlanetField("priority", value)}
                      label="Priority"
                    />

                    {/* Status */}
                    <StatusSelector
                      value={selectedPlanet?.status}
                      onChange={(value) => setPlanetField("status", value)}
                    />
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="text-white/90 font-medium ml-2">
                        Progress
                      </div>
                      <div className="text-white/70 text-sm">
                        {Math.round((selectedPlanet?.progress ?? 0) * 100)}%
                      </div>
                    </div>
                    <div className="relative mt-2">
                      {/* Custom Progress Bar */}
                      <div className="relative h-3 bg-white/10 rounded-full overflow-hidden border border-white/20">
                        <div
                          className="h-full rounded-full transition-transform duration-200 ease-out"
                          style={{
                            transform: `translateX(${
                              (selectedPlanet?.progress ?? 0) * 100 - 100
                            }%)`,
                            background: `linear-gradient(to right, 
                              rgb(${Math.round(
                                255 - (selectedPlanet?.progress ?? 0) * 255
                              )}, 
                                  ${Math.round(
                                    0 + (selectedPlanet?.progress ?? 0) * 255
                                  )}, 
                                  ${Math.round(
                                    0 + (selectedPlanet?.progress ?? 0) * 0
                                  )})
                            )`,
                          }}
                        />
                        {/* Glowing effect */}
                        <div
                          className="absolute top-0 right-0 h-full w-1 bg-white/60 rounded-full blur-sm transition-transform duration-200 ease-out"
                          style={{
                            transform: `translateX(${
                              (selectedPlanet?.progress ?? 0) * 100 - 100
                            }%)`,
                          }}
                        />
                      </div>

                      {/* Custom Range Input */}
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={Math.round(
                          (selectedPlanet?.progress ?? 0) * 100
                        )}
                        onChange={(e) =>
                          setPlanetField(
                            "progress",
                            Number(e.target.value) / 100
                          )
                        }
                        className="absolute inset-0 w-full h-3 opacity-0 cursor-pointer"
                      />

                      {/* Progress Markers */}
                      <div className="flex justify-between mt-1 px-1">
                        <div className="text-white/40 text-xs">0%</div>
                        <div className="text-white/40 text-xs">50%</div>
                        <div className="text-white/40 text-xs">100%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Section toggles */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mt-2"
              >
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => openSection("planning")}
                    className="cursor-pointer px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white hover:bg-white/15 transition-all duration-200"
                  >
                    {showPlanning ? "Hide Planning" : "Show Planning"}
                  </button>
                  <button
                    type="button"
                    onClick={() => openSection("risk")}
                    className="cursor-pointer px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white hover:bg-white/15 transition-all duration-200"
                  >
                    {showRisk ? "Hide Risk" : "Show Risk"}
                  </button>
                  <button
                    type="button"
                    onClick={() => openSection("tracking")}
                    className="cursor-pointer px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white hover:bg-white/15 transition-all duration-200"
                  >
                    {showTracking
                      ? "Hide Tracking & Docs"
                      : "Show Tracking & Docs"}
                  </button>
                  <button
                    type="button"
                    onClick={() => openSection("arrange")}
                    className="cursor-pointer px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white hover:bg-white/15 transition-all duration-200"
                  >
                    {showArrange ? "Hide Arrange" : "Show Arrange"}
                  </button>
                </div>
              </motion.div>

              {/* Planning Section */}
              <AnimatePresence>
                {showPlanning && (
                  <motion.div
                    ref={planningRef}
                    initial={{ opacity: 0, height: 0, y: 8 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: 8 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="space-y-4 ml-1 p-4 rounded-xl bg-white/5 border border-white/10 overflow-hidden"
                    style={{ willChange: "height, transform" }}
                    onAnimationComplete={() =>
                      handleSectionAnimationComplete("planning")
                    }
                  >
                    <PlanningSection
                      selectedPlanet={selectedPlanet}
                      setPlanetField={setPlanetField}
                      toggleDependency={toggleDependency}
                      otherPlanets={otherPlanets}
                      addMilestone={addMilestone}
                      removeMilestone={removeMilestone}
                      newMilestoneName={newMilestoneName}
                      setNewMilestoneName={setNewMilestoneName}
                      newMilestoneDue={newMilestoneDue}
                      setNewMilestoneDue={setNewMilestoneDue}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Risk Section */}
              <AnimatePresence>
                {showRisk && (
                  <motion.div
                    ref={riskRef}
                    initial={{ opacity: 0, height: 0, y: 8 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: 8 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="space-y-4 ml-1 p-4 rounded-xl bg-white/5 border border-white/10 overflow-hidden"
                    style={{ willChange: "height, transform" }}
                    onAnimationComplete={() =>
                      handleSectionAnimationComplete("risk")
                    }
                  >
                    <RiskSection
                      selectedPlanet={selectedPlanet}
                      setPlanetField={setPlanetField}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tracking Section */}
              <AnimatePresence>
                {showTracking && (
                  <motion.div
                    ref={trackingRef}
                    initial={{ opacity: 0, height: 0, y: 8 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: 8 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="space-y-4 ml-1 p-4 rounded-xl bg-white/5 border border-white/10 overflow-hidden"
                    style={{ willChange: "height, transform" }}
                    onAnimationComplete={() =>
                      handleSectionAnimationComplete("tracking")
                    }
                  >
                    <TrackingSection
                      selectedPlanet={selectedPlanet}
                      setPlanetField={setPlanetField}
                      tagsString={tagsString}
                      onTagsChange={onTagsChange}
                      addOutcome={addOutcome}
                      removeOutcome={removeOutcome}
                      newOutcomeLabel={newOutcomeLabel}
                      setNewOutcomeLabel={setNewOutcomeLabel}
                      newOutcomeTarget={newOutcomeTarget}
                      setNewOutcomeTarget={setNewOutcomeTarget}
                      addLink={addLink}
                      removeLink={removeLink}
                      newLinkTitle={newLinkTitle}
                      setNewLinkTitle={setNewLinkTitle}
                      newLinkUrl={newLinkUrl}
                      setNewLinkUrl={setNewLinkUrl}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Arrange Section */}
              <AnimatePresence>
                {showArrange && (
                  <motion.div
                    ref={arrangeRef}
                    initial={{ opacity: 0, height: 0, y: 8 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: 8 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="space-y-4 ml-1 p-4 rounded-xl bg-white/5 border border-white/10 overflow-hidden"
                    style={{ willChange: "height, transform" }}
                    onAnimationComplete={() =>
                      handleSectionAnimationComplete("arrange")
                    }
                  >
                    <ArrangeSection reorderPlanet={reorderPlanet} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          {selectedItem?.type === "moon" && (
            <div className="space-y-6">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 opacity-80">
                    <img
                      src={getMoonSvg(selectedItem.moonIndex || 0)}
                      alt="Moon"
                      className="w-full h-full filter drop-shadow-lg"
                    />
                  </div>
                  <div>
                    <div className="text-white/90 font-medium text-2xl">
                      {moonManagement.selectedMoon?.name || "Unnamed Moon"}
                    </div>
                    <div className="text-white/60 text-sm">
                      Task Management Hub
                    </div>
                  </div>
                </div>

                {/* Simple Moon Info */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="space-y-4">
                    {/* Moon Name */}
                    <div>
                      <input
                        className="w-full text-xl font-medium bg-transparent border-none outline-none text-white/90 placeholder-white/40"
                        value={moonManagement.selectedMoon?.name || ""}
                        onChange={(e) =>
                          moonManagement.setMoonField("name", e.target.value)
                        }
                        placeholder="Moon name..."
                      />
                    </div>

                    {/* Moon Description */}
                    <div>
                      <textarea
                        className="w-full bg-transparent border-none outline-none text-white/80 placeholder-white/40 resize-none"
                        rows="2"
                        value={moonManagement.selectedMoon?.description || ""}
                        onChange={(e) =>
                          moonManagement.setMoonField(
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="What is this moon about? What's its purpose?"
                      />
                    </div>

                    {/* Task Count */}
                    <div className="text-white/60 text-sm">
                      Task Group • {moonManagement.todoStats.total || 0} tasks
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Todo Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <TodoInput
                  onAdd={moonManagement.addTodo}
                  placeholder="What needs to be done on this moon?"
                  moonIconIndex={selectedItem.moonIndex || 0}
                />
              </motion.div>

              {/* Stats */}
              {moonManagement.todoStats.total > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <TodoStats
                    stats={moonManagement.todoStats}
                    moonIconIndex={selectedItem.moonIndex || 0}
                  />
                </motion.div>
              )}

              {/* Todo List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-white/90 font-medium text-lg">Tasks</h3>
                  {moonManagement.todoStats.total > 0 && (
                    <div className="text-white/60 text-sm">
                      {moonManagement.todoStats.completed} of{" "}
                      {moonManagement.todoStats.total} completed
                    </div>
                  )}
                </div>

                <TodoList
                  todos={moonManagement.selectedMoon?.todos || []}
                  onToggle={moonManagement.toggleTodo}
                  onEdit={moonManagement.editTodo}
                  onDelete={moonManagement.deleteTodo}
                  onUpdateField={moonManagement.updateTodoField}
                  onReorder={(newOrder) => {
                    moonManagement.setMoonField("todos", newOrder);
                  }}
                  moonIconIndex={selectedItem.moonIndex || 0}
                />
              </motion.div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onDelete?.(star?.id)}
          className="cursor-pointer px-3 py-2 rounded-xl bg-red-500/20 text-red-200 border border-red-400/30 hover:bg-red-500/30 hover:border-red-400/50 focus:outline-none focus:ring-2 focus:ring-red-400/30"
        >
          Delete System
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer px-3 py-2 rounded-xl bg-white/10 text-white border border-white/15 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onSave?.({ ...star, name })}
            className="cursor-pointer px-3 py-2 rounded-xl bg-emerald-500/30 text-emerald-100 border border-emerald-400/40 hover:bg-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoEditor;
