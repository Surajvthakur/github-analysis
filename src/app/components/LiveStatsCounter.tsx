"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface LiveStatsCounterProps {
  initialValue: number;
  label: string;
  icon: string;
  color: string;
  updateInterval?: number;
}

export default function LiveStatsCounter({
  initialValue,
  label,
  icon,
  color,
  updateInterval = 5000,
}: LiveStatsCounterProps) {
  const [value, setValue] = useState(initialValue);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsUpdating(true);
      // Simulate small random updates (in real app, fetch from API)
      const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
      setValue((prev) => Math.max(0, prev + change));
      setTimeout(() => setIsUpdating(false), 500);
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-lg border border-gray-700 ${
        isUpdating ? "ring-2 ring-blue-500" : ""
      } transition-all`}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-3xl">{icon}</span>
          {isUpdating && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-blue-400"
            >
              Updating...
            </motion.span>
          )}
        </div>
        <h3 className="text-sm font-medium text-gray-400 mb-1">{label}</h3>
        <motion.p
          key={value}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-3xl font-bold"
          style={{ color }}
        >
          {value.toLocaleString()}
        </motion.p>
      </div>
    </motion.div>
  );
}
