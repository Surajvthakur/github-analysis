"use client";

import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface DeveloperScoreProps {
  score: number;
  breakdown: Record<string, number>;
  level: string;
}

export default function DeveloperScore({
  score,
  breakdown,
  level,
}: DeveloperScoreProps) {
  const radarData = Object.entries(breakdown).map(([key, value]) => ({
    metric: key.charAt(0).toUpperCase() + key.slice(1),
    value: Math.round(value),
  }));

  const getScoreColor = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-500";
    if (score >= 60) return "from-blue-500 to-cyan-500";
    if (score >= 40) return "from-yellow-500 to-orange-500";
    return "from-gray-500 to-gray-600";
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      Legendary: "text-yellow-400",
      Expert: "text-purple-400",
      Advanced: "text-blue-400",
      Intermediate: "text-green-400",
      Rising: "text-cyan-400",
      Developing: "text-orange-400",
      Beginner: "text-gray-400",
      "Getting Started": "text-gray-500",
    };
    return colors[level] || "text-gray-400";
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700">
          <p className="font-semibold text-gray-100 mb-1">
            {payload[0].payload.metric}
          </p>
          <p className="text-sm text-gray-200">
            Score: {payload[0].value}/100
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <h3 className="text-xl font-bold mb-4 text-gray-100">Developer Score</h3>

      {/* Score Display */}
      <div className="mb-6">
        <div className="relative">
          <div className="flex items-center justify-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className={`relative w-48 h-48 rounded-full bg-gradient-to-br ${getScoreColor(
                score
              )} flex items-center justify-center shadow-2xl`}
            >
              <div className="absolute inset-4 rounded-full bg-gray-900 flex flex-col items-center justify-center">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-5xl font-bold text-white"
                >
                  {score}
                </motion.p>
                <p className="text-xs text-gray-400 mt-1">/ 100</p>
              </div>
            </motion.div>
          </div>

          <div className="text-center">
            <p className={`text-2xl font-bold ${getLevelColor(level)}`}>
              {level}
            </p>
            <p className="text-sm text-gray-400 mt-1">Developer Level</p>
          </div>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <PolarGrid stroke="#4b5563" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fontSize: 12, fill: "#9ca3af" }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: "#9ca3af" }}
            />
            <Radar
              name="Score"
              dataKey="value"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
