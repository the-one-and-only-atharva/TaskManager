import React, { useState } from "react";
import { motion } from "framer-motion";
import { getMoonSvg } from "../../constants/space";

const TodoInput = ({
  onAdd,
  placeholder = "Add a new task...",
  moonIconIndex = 0,
}) => {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text);
      setText("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`
        relative p-4 rounded-xl border transition-all duration-300
        ${
          isFocused
            ? "bg-white/15 border-white/25 shadow-lg shadow-white/10"
            : "bg-white/10 border-white/15 hover:bg-white/12 hover:border-white/20"
        }
        backdrop-blur-sm
      `}
      >
        {/* Background gradient effect */}
        <div
          className={`
          absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
          bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10
        `}
        />

        {/* Content */}
        <div className="relative z-10 flex items-center gap-3">
          {/* Moon icon */}
          <div className="flex-shrink-0 w-6 h-6 opacity-60 group-hover:opacity-80 transition-opacity duration-300">
            <img
              src={getMoonSvg(moonIconIndex)}
              alt="Moon"
              className="w-full h-full filter drop-shadow-lg"
            />
          </div>

          {/* Input field */}
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              className="w-full bg-transparent border-none outline-none text-white/90 placeholder-white/40 text-sm"
            />
          </div>

          {/* Add button */}
          <button
            type="submit"
            disabled={!text.trim()}
            className={`
              flex-shrink-0 p-2 rounded-lg transition-all duration-200
              ${
                text.trim()
                  ? "bg-emerald-500/30 hover:bg-emerald-500/50 text-emerald-300 hover:text-emerald-200 hover:scale-110"
                  : "bg-white/10 text-white/30 cursor-not-allowed"
              }
              focus:outline-none focus:ring-2 focus:ring-emerald-400/30
            `}
            title="Add task"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>

        {/* Subtle glow effect */}
        {isFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/5 to-blue-500/5 border border-emerald-400/20"
          />
        )}
      </div>
    </motion.form>
  );
};

export default TodoInput;
