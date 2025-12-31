"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

export default function RadarComparison({
  data,
  users,
}: {
  data: any[];
  users: string[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full h-[420px] rounded-2xl"
    >
      <h3 className="text-xl font-bold mb-4 text-center">
        🕸 Profile Strength Comparison
      </h3>

      <ResponsiveContainer>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" />
          <PolarRadiusAxis angle={90} domain={[0, 100]} />

          <Radar
            name={users[0]}
            dataKey={users[0]}
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.3}
          />
          <Radar
            name={users[1]}
            dataKey={users[1]}
            stroke="#22c55e"
            fill="#22c55e"
            fillOpacity={0.3}
          />

          <Tooltip />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
