"use client";

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { useState } from "react";

interface StarHistoryProps {
  repos: Array<{
    name: string;
    stargazers_count: number;
    created_at?: string;
  }>;
}

export default function StarHistory({ repos }: StarHistoryProps) {
  const [view, setView] = useState<"line" | "area">("area");

  // Sort by stars and take top 10
  const topRepos = repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 10)
    .map((repo) => ({
      name: repo.name.length > 15 ? repo.name.substring(0, 15) + "..." : repo.name,
      stars: repo.stargazers_count,
      fullName: repo.name,
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700">
          <p className="font-semibold mb-2 text-gray-100">{label}</p>
          <p className="text-sm text-gray-200" style={{ color: payload[0].color }}>
            Stars: {payload[0].value.toLocaleString()}
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-100">Top Repositories by Stars</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setView("line")}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              view === "line"
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Line
          </button>
          <button
            onClick={() => setView("area")}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              view === "area"
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Area
          </button>
        </div>
      </div>

      <div className="h-80">
        {view === "line" ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={topRepos} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" opacity={0.3} />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
              />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="stars"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ r: 5, fill: "#f59e0b" }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={topRepos} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
              <defs>
                <linearGradient id="colorStars" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" opacity={0.3} />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
              />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="stars"
                stroke="#f59e0b"
                fillOpacity={1}
                fill="url(#colorStars)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
