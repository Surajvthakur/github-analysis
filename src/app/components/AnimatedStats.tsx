"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface StatCard {
  label: string;
  value: number;
  icon: string;
  color: string;
  change?: number;
}

interface AnimatedStatsProps {
  stats: StatCard[];
}

export default function AnimatedStats({ stats }: AnimatedStatsProps) {
  const [countedValues, setCountedValues] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    stats.forEach((stat) => {
      animateValue(stat.label, 0, stat.value, 1500);
    });
  }, [stats]);

  function animateValue(
    label: string,
    start: number,
    end: number,
    duration: number
  ) {
    const startTime = performance.now();
    const range = end - start;

    function update(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + range * easeOutQuart);

      setCountedValues((prev) => ({ ...prev, [label]: current }));

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-lg border border-gray-700 hover:shadow-xl transition-shadow"
        >
          {/* Background decoration */}
          <div
            className={`absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl`}
            style={{ backgroundColor: stat.color }}
          />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">{stat.icon}</span>
              {stat.change !== undefined && (
                <span
                  className={`text-sm font-semibold ${
                    stat.change >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.change >= 0 ? "↑" : "↓"} {Math.abs(stat.change)}%
                </span>
              )}
            </div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">
              {stat.label}
            </h3>
            <p
              className="text-3xl font-bold"
              style={{ color: stat.color }}
            >
              {countedValues[stat.label]?.toLocaleString() || 0}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
