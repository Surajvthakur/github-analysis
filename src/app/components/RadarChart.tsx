"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";

interface SkillRadarChartProps {
  data: Array<{
    language: string;
    count: number;
    stars: number;
    forks: number;
  }>;
}

export default function SkillRadarChart({ data }: SkillRadarChartProps) {
  // Normalize data for radar chart (0-100 scale)
  const maxCount = Math.max(...data.map((d) => d.count));
  const maxStars = Math.max(...data.map((d) => d.stars));
  const maxForks = Math.max(...data.map((d) => d.forks));

  const radarData = data.slice(0, 8).map((item) => ({
    language: item.language,
    Repositories: Math.round((item.count / maxCount) * 100),
    Stars: Math.round((item.stars / maxStars) * 100),
    Forks: Math.round((item.forks / maxForks) * 100),
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700">
          <p className="font-semibold mb-2 text-gray-100">{payload[0].payload.language}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm text-gray-200">
              {entry.name}: {entry.value}%
            </p>
          ))}
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
      <h3 className="text-xl font-bold mb-4 text-gray-100">Skill Distribution Radar</h3>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <PolarGrid stroke="#4b5563" />
            <PolarAngleAxis
              dataKey="language"
              tick={{ fontSize: 12, fill: "#9ca3af" }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: "#9ca3af" }}
            />
            <Radar
              name="Repositories"
              dataKey="Repositories"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
            />
            <Radar
              name="Stars"
              dataKey="Stars"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
            />
            <Radar
              name="Forks"
              dataKey="Forks"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.6}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
