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
import { useState } from "react";

interface EventTypeChartProps {
  events: Array<{
    type: string;
    created_at: string;
  }>;
}

const EVENT_COLORS: Record<string, string> = {
  PushEvent: "#10b981",
  PullRequestEvent: "#3b82f6",
  IssuesEvent: "#f59e0b",
  WatchEvent: "#ec4899",
  ForkEvent: "#8b5cf6",
  CreateEvent: "#06b6d4",
  DeleteEvent: "#ef4444",
  Other: "#6b7280",
};

function formatEventType(type: string): string {
  return type.replace("Event", "");
}

export default function EventTypeChart({ events }: EventTypeChartProps) {
  const [view, setView] = useState<"pie" | "bar">("pie");

  // Count events by type
  const eventCounts: Record<string, number> = {};
  events.forEach((event) => {
    const type = event.type;
    eventCounts[type] = (eventCounts[type] || 0) + 1;
  });

  const chartData = Object.entries(eventCounts)
    .map(([name, value]) => ({
      name: formatEventType(name),
      value,
      fullName: name,
    }))
    .sort((a, b) => b.value - a.value);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700">
          <p className="font-semibold text-gray-100">{payload[0].name}</p>
          <p className="text-sm text-gray-200" style={{ color: payload[0].payload.fill }}>
            Count: {payload[0].value}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {(
              (payload[0].value / events.length) *
              100
            ).toFixed(1)}% of total
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-100">Event Type Distribution</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setView("pie")}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              view === "pie"
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Pie
          </button>
          <button
            onClick={() => setView("bar")}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              view === "bar"
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Bar
          </button>
        </div>
      </div>

      <div className="h-80">
        {view === "pie" ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) =>
                  percent ? `${name} ${(percent * 100).toFixed(0)}%` : name
                }
                animationDuration={800}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      EVENT_COLORS[entry.fullName] || EVENT_COLORS.Other
                    }
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={EVENT_COLORS[entry.fullName] || EVENT_COLORS.Other}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
