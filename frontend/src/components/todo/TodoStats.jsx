import React from "react";
import { motion } from "framer-motion";
import { getMoonSvg } from "../../constants/space";

const TodoStats = ({ stats, moonIconIndex = 0 }) => {
  const { total, completed, pending, percentage } = stats;

  if (total === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 opacity-70">
          <img
            src={getMoonSvg(moonIconIndex)}
            alt="Moon"
            className="w-full h-full filter drop-shadow-lg"
          />
        </div>
        <div className="text-white/90 font-medium">Progress Overview</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">{total}</div>
          <div className="text-xs text-white/60">Total Tasks</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-400 mb-1">
            {completed}
          </div>
          <div className="text-xs text-white/60">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400 mb-1">{pending}</div>
          <div className="text-xs text-white/60">Pending</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/70">Completion</span>
          <span className="text-white/90 font-medium">{percentage}%</span>
        </div>

        <div className="relative h-3 bg-white/10 rounded-full overflow-hidden border border-white/20">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20" />

          {/* Progress fill */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative h-full rounded-full overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500" />

            {/* Glowing effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </motion.div>

          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
        </div>
      </div>

      {/* Motivational message */}
      {percentage === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-3 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-center"
        >
          <div className="text-emerald-300 text-sm font-medium">
            🎉 All tasks completed!
          </div>
        </motion.div>
      )}

      {percentage > 0 && percentage < 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-3 rounded-lg bg-blue-500/20 border border-blue-400/30 text-center"
        >
          <div className="text-blue-300 text-sm font-medium">
            🚀 Keep going! You're making progress!
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TodoStats;
