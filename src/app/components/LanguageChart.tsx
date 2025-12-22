"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

const COLORS = [
  "url(#grad-js)",
  "url(#grad-ts)",
  "url(#grad-py)",
  "url(#grad-go)",
  "url(#grad-other)",
];

interface DataItem {
  name: string;
  value: number;
}

export default function LanguageChart({ data }: { data: DataItem[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="h-96 w-full"
    >
      <ResponsiveContainer>
        <PieChart>
          {/* 🎨 Gradients */}
          <defs>
            <linearGradient id="grad-js" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            <linearGradient id="grad-ts" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="grad-py" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
            <linearGradient id="grad-go" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            <linearGradient id="grad-other" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>

          {/* 🧠 Donut Chart */}
          <Pie
            data={data as any}
            dataKey="value"
            nameKey="name"
            innerRadius={70}
            outerRadius={130}
            paddingAngle={4}
            isAnimationActive={true}
            animationDuration={800}
            label={(props: any) => {
              const { name, value } = props;
              if (!name || value === undefined) return false;
              const percentage = (value / total) * 100;
              // Only show labels for segments above 3% to prevent overlapping
              if (percentage >= 3) {
                return `${name} (${Math.round(percentage)}%)`;
              }
              return false; // Hide label for small segments
            }}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie >

          <Tooltip />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
