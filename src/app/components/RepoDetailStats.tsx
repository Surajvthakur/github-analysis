"use client";

import { motion } from "framer-motion";

interface RepoDetailStatsProps {
  repo: any;
  contributors: any[];
}

export default function RepoDetailStats({
  repo,
  contributors,
}: RepoDetailStatsProps) {
  const stats = [
    {
      label: "Stars",
      value: repo.stargazers_count,
      icon: "⭐",
      color: "#f59e0b",
    },
    {
      label: "Forks",
      value: repo.forks_count,
      icon: "🍴",
      color: "#10b981",
    },
    {
      label: "Watchers",
      value: repo.watchers_count,
      icon: "👁️",
      color: "#3b82f6",
    },
    {
      label: "Contributors",
      value: contributors.length,
      icon: "👥",
      color: "#8b5cf6",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <h3 className="text-xl font-bold mb-4 text-gray-100">Repository Statistics</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-lg bg-gray-900/50 border border-gray-700 text-center"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <p className="text-2xl font-bold" style={{ color: stat.color }}>
              {stat.value.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Repository Info */}
      <div className="space-y-4">
        {repo.description && (
          <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-700">
            <p className="text-sm text-gray-400 mb-2">Description</p>
            <p className="text-gray-200">{repo.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-700">
            <p className="text-sm text-gray-400 mb-2">Language</p>
            <p className="text-gray-200 font-semibold">
              {repo.language || "N/A"}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-700">
            <p className="text-sm text-gray-400 mb-2">License</p>
            <p className="text-gray-200 font-semibold">
              {repo.license?.name || "No License"}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-700">
            <p className="text-sm text-gray-400 mb-2">Created</p>
            <p className="text-gray-200 font-semibold">
              {new Date(repo.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-700">
            <p className="text-sm text-gray-400 mb-2">Last Updated</p>
            <p className="text-gray-200 font-semibold">
              {new Date(repo.updated_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
