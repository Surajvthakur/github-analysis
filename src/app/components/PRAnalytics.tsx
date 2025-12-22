"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";

interface PRAnalyticsProps {
  open: number;
  closed: number;
  merged: number;
  avgMergeTime: number;
}

export default function PRAnalytics({
  open,
  closed,
  merged,
  avgMergeTime,
}: PRAnalyticsProps) {
  const chartData = [
    { name: "Open", value: open, color: "#3b82f6" },
    { name: "Merged", value: merged, color: "#10b981" },
    { name: "Closed", value: closed, color: "#ef4444" },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700">
          <p className="font-semibold text-gray-100 mb-1">
            {payload[0].name}
          </p>
          <p className="text-sm text-gray-200">
            Count: {payload[0].value}
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
      <h3 className="text-xl font-bold mb-4 text-gray-100">Pull Request Analytics</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PR Status Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-700">
            <p className="text-sm text-gray-400 mb-1">Total PRs</p>
            <p className="text-2xl font-bold text-gray-100">
              {open + closed + merged}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-700">
            <p className="text-sm text-gray-400 mb-1">Merge Rate</p>
            <p className="text-2xl font-bold text-green-400">
              {open + closed + merged > 0
                ? Math.round((merged / (open + closed + merged)) * 100)
                : 0}
              %
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-700">
            <p className="text-sm text-gray-400 mb-1">Avg Merge Time</p>
            <p className="text-2xl font-bold text-blue-400">
              {avgMergeTime.toFixed(1)} days
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
