"use client";

import { eachDayOfInterval, subDays, format, startOfWeek, endOfWeek } from "date-fns";
import { motion } from "framer-motion";
import { useState } from "react";

interface EnhancedHeatmapProps {
  data: Record<string, number>;
}

export default function EnhancedHeatmap({ data }: EnhancedHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const days = eachDayOfInterval({
    start: subDays(new Date(), 364),
    end: new Date(),
  });

  // Group days by weeks
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  days.forEach((day, index) => {
    if (index % 7 === 0 && currentWeek.length > 0) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
    currentWeek.push(day);
  });
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const maxCount = Math.max(...Object.values(data), 1);

  function getIntensity(count: number): string {
    if (count === 0) return "bg-gray-800";
    const intensity = count / maxCount;
    if (intensity < 0.25) return "bg-green-900";
    if (intensity < 0.5) return "bg-green-700";
    if (intensity < 0.75) return "bg-green-600";
    return "bg-green-500";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-100">Contribution Heatmap (Last Year)</h3>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded bg-gray-800" />
            <div className="w-3 h-3 rounded bg-green-900" />
            <div className="w-3 h-3 rounded bg-green-700" />
            <div className="w-3 h-3 rounded bg-green-600" />
            <div className="w-3 h-3 rounded bg-green-500" />
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-1 p-4 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day) => {
                const key = format(day, "yyyy-MM-dd");
                const count = data[key] || 0;
                const isHovered = hoveredDay === key;
                const isSelected = selectedDay === key;

                return (
                  <motion.div
                    key={key}
                    onMouseEnter={() => setHoveredDay(key)}
                    onMouseLeave={() => setHoveredDay(null)}
                    onClick={() => setSelectedDay(selectedDay === key ? null : key)}
                    whileHover={{ scale: 1.3, zIndex: 10 }}
                    whileTap={{ scale: 1.1 }}
                    className={`w-3 h-3 rounded cursor-pointer transition-all ${
                      getIntensity(count)
                    } ${
                      isHovered || isSelected
                        ? "ring-2 ring-blue-500 ring-offset-2"
                        : ""
                    }`}
                    title={`${format(day, "MMM dd, yyyy")}: ${count} contribution${count !== 1 ? "s" : ""}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {selectedDay && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-blue-900/20 rounded-lg border border-blue-800"
        >
          <p className="text-sm font-semibold text-blue-100">
            {format(new Date(selectedDay), "EEEE, MMMM dd, yyyy")}
          </p>
          <p className="text-sm text-blue-300">
            {data[selectedDay] || 0} contribution{data[selectedDay] !== 1 ? "s" : ""}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
