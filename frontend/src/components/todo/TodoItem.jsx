import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { getMoonSvg } from "../../constants/space";

const TodoItem = ({
  todo,
  onToggle,
  onEdit,
  onDelete,
  onUpdateField,
  index,
  isEditing = false,
  onEditStart,
  onEditCancel,
  onEditSave,
}) => {
  const [editText, setEditText] = useState(todo.text);
  const [isExpanded, setIsExpanded] = useState(false);
  const itemRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const handleEditStart = () => {
    setEditText(todo.text);
    onEditStart();
  };

  const handleEditSave = () => {
    if (editText.trim() && editText !== todo.text) {
      onEdit(todo.id, editText);
    }
    onEditSave();
  };

  const handleEditCancel = () => {
    setEditText(todo.text);
    onEditCancel();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleEditSave();
    } else if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  // Simple auto-scroll when expanded
  useEffect(() => {
    if (isExpanded && itemRef.current) {
      // Simple scroll into view with a small delay
      const timer = setTimeout(() => {
        itemRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  return (
    <motion.div
      ref={itemRef}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="group relative"
    >
      <div
        className={`
				  relative p-4 rounded-xl border transition-all duration-300 max-w-[95%] mx-auto
				  ${
            todo.completed
              ? "bg-white/5 border-white/5 text-white/60"
              : "bg-white/10 border-white/15 text-white/90 hover:bg-white/15 hover:border-white/25"
          }
				  backdrop-blur-sm hover:shadow-lg hover:shadow-white/5
				`}
      >
        {/* Background gradient effect */}
        <div
          className={`
					  absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
					  ${
              todo.completed
                ? "bg-gradient-to-r from-green-500/10 to-emerald-500/10"
                : "bg-gradient-to-r from-blue-500/10 to-purple-500/10"
            }
					`}
        />

        {/* Content */}
        <div className="relative z-20 flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={() => onToggle(todo.id)}
            className={`
						  flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-200
						  ${
                todo.completed
                  ? "bg-emerald-500/80 border-emerald-400/60"
                  : "border-white/30 hover:border-white/50"
              }
						  hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/30
						`}
            aria-pressed={todo.completed}
          >
            {todo.completed && (
              <motion.svg
                initial={reduceMotion ? false : { scale: 0 }}
                animate={{ scale: 1 }}
                className="w-full h-full text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </motion.svg>
            )}
          </button>

          {/* Todo text */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-none outline-none text-white/90 placeholder-white/40"
                autoFocus
              />
            ) : (
              <div
                className={`
								  text-sm leading-relaxed transition-all duration-200
								  ${todo.completed ? "line-through opacity-70" : ""}
								`}
                onDoubleClick={handleEditStart}
              >
                {todo.text}
              </div>
            )}

            {/* Creation time */}
            <div className="text-xs text-white/40 mt-1">
              {new Date(todo.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
                  title={isExpanded ? "Collapse details" : "Expand details"}
                >
                  <svg
                    className={`w-3.5 h-3.5 text-white/70 transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleEditStart}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
                  title="Edit todo"
                >
                  <svg
                    className="w-3.5 h-3.5 text-white/70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(todo.id)}
                  className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors duration-200"
                  title="Delete todo"
                >
                  <svg
                    className="w-3.5 h-3.5 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEditSave}
                  className="p-1.5 rounded-lg bg-emerald-500/30 hover:bg-emerald-500/50 transition-colors duration-200"
                  title="Save changes"
                >
                  <svg
                    className="w-3.5 h-3.5 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleEditCancel}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
                  title="Cancel edit"
                >
                  <svg
                    className="w-3.5 h-3.5 text-white/70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Expandable Task Details */}
        {isExpanded && (
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={
              reduceMotion ? { opacity: 1 } : { opacity: 1, height: "auto" }
            }
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-20 mt-4 pt-4 border-t border-white/10 space-y-4"
          >
            {/* Task Metadata Row */}
            <div className="flex items-center gap-3 text-sm">
              <select
                className="px-2 py-1 rounded bg-white/10 border border-white/10 text-white/80 focus:outline-none focus:ring-1 focus:ring-white/30"
                value={todo.priority || "medium"}
                onChange={(e) =>
                  onUpdateField(todo.id, "priority", e.target.value)
                }
              >
                <option value="low" className="bg-slate-800 text-white">
                  Low
                </option>
                <option value="medium" className="bg-slate-800 text-white">
                  Medium
                </option>
                <option value="high" className="bg-slate-800 text-white">
                  High
                </option>
                <option value="critical" className="bg-slate-800 text-white">
                  Critical
                </option>
              </select>

              <select
                className="px-2 py-1 rounded bg-white/10 border border-white/10 text-white/80 focus:outline-none focus:ring-1 focus:ring-white/30"
                value={todo.status || "active"}
                onChange={(e) =>
                  onUpdateField(todo.id, "status", e.target.value)
                }
              >
                <option value="active" className="bg-slate-800 text-white">
                  Active
                </option>
                <option value="paused" className="bg-slate-800 text-white">
                  Paused
                </option>
                <option value="completed" className="bg-slate-800 text-white">
                  Completed
                </option>
                <option value="archived" className="bg-slate-800 text-white">
                  Archived
                </option>
              </select>

              <input
                type="date"
                className="px-2 py-1 rounded bg-white/10 border border-white/10 text-white/80 focus:outline-none focus:ring-1 focus:ring-white/30 text-xs"
                value={todo.dueDate || ""}
                onChange={(e) =>
                  onUpdateField(todo.id, "dueDate", e.target.value)
                }
              />

              <input
                type="number"
                min="0"
                step="0.5"
                className="w-16 px-2 py-1 rounded bg-white/10 border border-white/10 text-white/80 focus:outline-none focus:ring-1 focus:ring-white/30 text-xs"
                value={todo.estimatedHours || ""}
                onChange={(e) =>
                  onUpdateField(todo.id, "estimatedHours", e.target.value)
                }
                placeholder="hrs"
              />
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-xs">🏷️</span>
              <input
                className="flex-1 bg-transparent border-none outline-none text-white/70 placeholder-white/40 text-sm"
                value={todo.tags?.join(", ") || ""}
                onChange={(e) => {
                  const tags = e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean);
                  onUpdateField(todo.id, "tags", tags);
                }}
                placeholder="Add tags..."
              />
            </div>

            {/* Notes */}
            <div>
              <textarea
                className="w-full bg-transparent border-none outline-none text-white/70 placeholder-white/40 resize-none text-sm"
                rows="2"
                value={todo.notes || ""}
                onChange={(e) =>
                  onUpdateField(todo.id, "notes", e.target.value)
                }
                placeholder="Add notes..."
              />
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  const today = new Date().toISOString().split("T")[0];
                  onUpdateField(todo.id, "dueDate", today);
                }}
                className="px-2 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30 hover:bg-blue-500/30 transition-colors text-xs"
              >
                Due Today
              </button>
              <button
                type="button"
                onClick={() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  onUpdateField(
                    todo.id,
                    "dueDate",
                    tomorrow.toISOString().split("T")[0]
                  );
                }}
                className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-400/30 hover:bg-purple-500/30 transition-colors text-xs"
              >
                Due Tomorrow
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateField(todo.id, "status", "active");
                  onUpdateField(todo.id, "priority", "high");
                }}
                className="px-2 py-1 rounded bg-orange-500/20 text-orange-300 border border-orange-400/30 hover:bg-orange-500/30 transition-colors text-xs"
              >
                Mark Urgent
              </button>
            </div>
          </motion.div>
        )}

        {/* Decorative moon icon */}
        <div className="absolute -top-2 -left-2 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
          <img
            src={getMoonSvg(index)}
            alt="Moon"
            className="w-6 h-6 filter drop-shadow-lg"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TodoItem;
