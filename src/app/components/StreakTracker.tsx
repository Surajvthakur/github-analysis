"use client";

import { motion } from "framer-motion";

interface StreakTrackerProps {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
}

export default function StreakTracker({
  currentStreak,
  longestStreak,
  totalDays,
}: StreakTrackerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <h3 className="text-xl font-bold mb-4 text-gray-100">Contribution Streaks</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 p-6 border border-orange-500/30"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <p className="text-sm text-gray-400 mb-2">Current Streak</p>
            <p className="text-4xl font-bold text-orange-400">
              {currentStreak}
            </p>
            <p className="text-xs text-gray-500 mt-1">days</p>
          </div>
        </motion.div>

        {/* Longest Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-6 border border-purple-500/30"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <p className="text-sm text-gray-400 mb-2">Longest Streak</p>
            <p className="text-4xl font-bold text-purple-400">
              {longestStreak}
            </p>
            <p className="text-xs text-gray-500 mt-1">days</p>
          </div>
        </motion.div>

        {/* Total Days */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-6 border border-blue-500/30"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <p className="text-sm text-gray-400 mb-2">Total Active Days</p>
            <p className="text-4xl font-bold text-blue-400">
              {totalDays}
            </p>
            <p className="text-xs text-gray-500 mt-1">days</p>
          </div>
        </motion.div>
      </div>

      {/* Visual Streak Display */}
      <div className="mt-6">
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: Math.min(currentStreak, 30) }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05, type: "spring" }}
              className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-400 to-red-500"
            />
          ))}
          {currentStreak > 30 && (
            <span className="text-sm text-gray-400 self-center">
              +{currentStreak - 30} more
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
