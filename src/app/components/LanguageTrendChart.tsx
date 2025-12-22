"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { motion } from "framer-motion";

interface LanguageTrendChartProps {
  repos: Array<{
    language: string;
    stargazers_count: number;
    created_at?: string;
  }>;
}

export default function LanguageTrendChart({ repos }: LanguageTrendChartProps) {
  // Group by language and calculate totals
  const languageData: Record<
    string,
    { count: number; stars: number; repos: any[] }
  > = {};

  repos.forEach((repo) => {
    if (!repo.language) return;
    if (!languageData[repo.language]) {
      languageData[repo.language] = { count: 0, stars: 0, repos: [] };
    }
    languageData[repo.language].count++;
    languageData[repo.language].stars += repo.stargazers_count;
    languageData[repo.language].repos.push(repo);
  });

  const chartData = Object.entries(languageData)
    .map(([language, data]) => ({
      language,
      repositories: data.count,
      stars: data.stars,
      avgStars: Math.round(data.stars / data.count),
    }))
    .sort((a, b) => b.repositories - a.repositories)
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700">
          <p className="font-semibold mb-2 text-gray-100">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm text-gray-200">
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
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
      <h3 className="text-xl font-bold mb-4 text-gray-100">Language Performance</h3>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" opacity={0.3} />
            <XAxis
              dataKey="language"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
            />
            <YAxis yAxisId="left" tick={{ fontSize: 12, fill: "#9ca3af" }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: "#9ca3af" }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="repositories"
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
              name="Repositories"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="stars"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
              name="Total Stars"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
