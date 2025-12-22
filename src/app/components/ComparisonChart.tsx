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
  Legend,
} from "recharts";
import { motion } from "framer-motion";

interface ComparisonChartProps {
  user1: string;
  user2: string;
  data1: number;
  data2: number;
  label: string;
}

export default function ComparisonChart({
  user1,
  user2,
  data1,
  data2,
  label,
}: ComparisonChartProps) {
  const chartData = [
    { name: user1, value: data1 },
    { name: user2, value: data2 },
  ];

  const maxValue = Math.max(data1, data2, 1);
  const colors = ["#3b82f6", "#8b5cf6"];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700">
          <p className="font-semibold mb-1 text-gray-100">{payload[0].name}</p>
          <p className="text-sm text-gray-200" style={{ color: payload[0].color }}>
            {label}: {payload[0].value.toLocaleString()}
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
      <h4 className="text-lg font-semibold mb-4 text-gray-100">{label}</h4>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" opacity={0.3} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9ca3af" }} />
            <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} domain={[0, maxValue * 1.1]} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
