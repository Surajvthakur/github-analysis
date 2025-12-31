"use client";

import { motion } from "framer-motion";

const COLORS = [
  { start: "#facc15", end: "#f97316" }, // JS yellow-orange
  { start: "#3b82f6", end: "#6366f1" }, // TS blue-indigo
  { start: "#22c55e", end: "#16a34a" }, // Python green
  { start: "#06b6d4", end: "#0ea5e9" }, // Go cyan
  { start: "#a855f7", end: "#ec4899" }, // Other purple-pink
  { start: "#f43f5e", end: "#e11d48" }, // Rose
  { start: "#14b8a6", end: "#0d9488" }, // Teal
  { start: "#f59e0b", end: "#d97706" }, // Amber
  { start: "#8b5cf6", end: "#7c3aed" }, // Violet
  { start: "#ef4444", end: "#dc2626" }, // Red
];

interface DataItem {
  name: string;
  value: number;
}

export default function LanguageChart({ data }: { data: DataItem[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const sortedData = [...data].sort((a, b) => b.value - a.value).slice(0, 10);
  const maxValue = sortedData.length > 0 ? sortedData[0].value : 1;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="h-96 w-full overflow-y-auto space-y-3 pr-2"
    >
      {sortedData.map((item, index) => {
        const percentage = (item.value / total) * 100;
        const barWidth = (item.value / maxValue) * 100;
        const color = COLORS[index % COLORS.length];

        return (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="group"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: `linear-gradient(135deg, ${color.start}, ${color.end})` }}
                />
                <span className="font-medium text-sm text-gray-200">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>{item.value} repos</span>
                <span className="text-blue-400 font-semibold">{percentage.toFixed(1)}%</span>
              </div>
            </div>
            <div className="relative h-6 bg-gray-800/50 rounded-lg overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${barWidth}%` }}
                transition={{ delay: index * 0.05 + 0.2, duration: 0.5, ease: "easeOut" }}
                className="h-full rounded-lg relative overflow-hidden"
                style={{
                  background: `linear-gradient(90deg, ${color.start}, ${color.end})`,
                }}
              >
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
                    animation: 'shimmer 2s infinite',
                  }}
                />
              </motion.div>
              {/* Value label inside bar */}
              {barWidth > 20 && (
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white/90">
                  {item.value}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}

      {sortedData.length === 0 && (
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
          No language data available
        </div>
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </motion.div>
  );
}
