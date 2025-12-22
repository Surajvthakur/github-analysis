"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { format, subDays } from "date-fns";

interface ActivityTimelineProps {
  events: Array<{
    type: string;
    created_at: string;
  }>;
}

export default function ActivityTimeline({ events }: ActivityTimelineProps) {
  // Group events by day for the last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    return format(date, "yyyy-MM-dd");
  });

  const eventCounts = last30Days.map((date) => {
    const dayEvents = events.filter((event) =>
      event.created_at.startsWith(date)
    );

    const counts = {
      date: format(new Date(date), "MMM dd"),
      Push: dayEvents.filter((e) => e.type === "PushEvent").length,
      PullRequest: dayEvents.filter((e) => e.type === "PullRequestEvent").length,
      Issue: dayEvents.filter((e) => e.type === "IssuesEvent").length,
      Other: dayEvents.filter(
        (e) =>
          !["PushEvent", "PullRequestEvent", "IssuesEvent"].includes(e.type)
      ).length,
    };

    return counts;
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce(
        (sum: number, entry: any) => sum + entry.value,
        0
      );
      return (
        <div className="bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700">
          <p className="font-semibold mb-2 text-gray-100">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm text-gray-200">
              {entry.name}: {entry.value}
            </p>
          ))}
          <p className="text-sm font-semibold mt-2 pt-2 border-t border-gray-700 text-gray-100">
            Total: {total}
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
      <h3 className="text-xl font-bold mb-4 text-gray-100">Activity Timeline (Last 30 Days)</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={eventCounts} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" opacity={0.3} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="Push"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="PullRequest"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Issue"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Other"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
