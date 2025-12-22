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

interface IssueTrackerProps {
  open: number;
  closed: number;
  labels: Record<string, number>;
}

export default function IssueTracker({
  open,
  closed,
  labels,
}: IssueTrackerProps) {
  const statusData = [
    { name: "Open", value: open, color: "#ef4444" },
    { name: "Closed", value: closed, color: "#10b981" },
  ];

  const labelData = Object.entries(labels)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const COLORS = [
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#06b6d4",
    "#ef4444",
    "#84cc16",
    "#f97316",
    "#6366f1",
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
      <h3 className="text-xl font-bold mb-4 text-gray-100">Issue Tracking</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Issue Status */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {statusData.map((entry, index) => (
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
            <p className="text-sm text-gray-400 mb-1">Total Issues</p>
            <p className="text-2xl font-bold text-gray-100">
              {open + closed}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-700">
            <p className="text-sm text-gray-400 mb-1">Open Issues</p>
            <p className="text-2xl font-bold text-red-400">{open}</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-700">
            <p className="text-sm text-gray-400 mb-1">Closed Issues</p>
            <p className="text-2xl font-bold text-green-400">{closed}</p>
          </div>
        </div>
      </div>

      {/* Issue Labels */}
      {labelData.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-4 text-gray-200">
            Issue Labels
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={labelData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" opacity={0.3} />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                />
                <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {labelData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </motion.div>
  );
}
