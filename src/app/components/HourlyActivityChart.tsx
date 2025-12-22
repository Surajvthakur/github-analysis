"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { motion } from "framer-motion";

interface HourlyActivityChartProps {
  data: Record<number, number>;
}

export default function HourlyActivityChart({ data }: HourlyActivityChartProps) {
  // Convert to array format for chart
  const chartData = Array.from({ length: 24 }, (_, hour) => ({
    hour: hour.toString().padStart(2, "0") + ":00",
    value: data[hour] || 0,
    hourNum: hour,
  }));

  const maxValue = Math.max(...chartData.map((d) => d.value), 1);

  const getColor = (value: number) => {
    if (value === 0) return "#374151";
    const intensity = value / maxValue;
    if (intensity < 0.25) return "#10b981";
    if (intensity < 0.5) return "#22c55e";
    if (intensity < 0.75) return "#16a34a";
    return "#15803d";
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700">
          <p className="font-semibold mb-1 text-gray-100">
            {payload[0].payload.hour}
          </p>
          <p className="text-sm text-gray-200">
            Commits: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <h3 className="text-xl font-bold mb-4 text-gray-100">
        Hourly Activity Pattern
      </h3>
      <p className="text-sm text-gray-400 mb-4">
        Your most productive hours of the day
      </p>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" opacity={0.3} />
            <XAxis
              dataKey="hour"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              interval={2}
            />
            <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.value)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
