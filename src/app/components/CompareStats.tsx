"use client";

import { motion } from "framer-motion";

function StatRow({
  label,
  v1,
  v2,
  user1,
  user2,
}: {
  label: string;
  v1: number;
  v2: number;
  user1: string;
  user2: string;
}) {
  const winner = v1 > v2 ? "left" : v2 > v1 ? "right" : "tie";
  const maxValue = Math.max(v1, v2, 1);
  const percentage1 = (v1 / maxValue) * 100;
  const percentage2 = (v2 / maxValue) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="py-4 border-b border-gray-700 last:border-b-0"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-300">
          {label}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">{user1}</span>
            <span
              className={`text-lg font-bold ${
                winner === "left" && "text-green-600 dark:text-green-400"
              }`}
            >
              {v1.toLocaleString()}
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage1}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className={`h-full ${
                winner === "left"
                  ? "bg-green-500"
                  : "bg-blue-500"
              }`}
            />
          </div>
        </div>
        <div className="relative">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">{user2}</span>
            <span
              className={`text-lg font-bold ${
                winner === "right" && "text-green-600 dark:text-green-400"
              }`}
            >
              {v2.toLocaleString()}
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage2}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className={`h-full ${
                winner === "right"
                  ? "bg-green-500"
                  : "bg-purple-500"
              }`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function CompareStats({
  user1,
  user2,
}: {
  user1: any;
  user2: any;
}) {
  return (
    <div>
      <h3 className="text-2xl font-bold mb-6 text-gray-100">Statistics Comparison</h3>
      <div className="bg-gray-900/50 rounded-xl p-6">
        <StatRow
          label="Followers"
          v1={user1.followers}
          v2={user2.followers}
          user1={user1.login}
          user2={user2.login}
        />
        <StatRow
          label="Public Repositories"
          v1={user1.public_repos}
          v2={user2.public_repos}
          user1={user1.login}
          user2={user2.login}
        />
        <StatRow
          label="Following"
          v1={user1.following}
          v2={user2.following}
          user1={user1.login}
          user2={user2.login}
        />
      </div>
    </div>
  );
}
  