"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function CompareUsers() {
  const [user1, setUser1] = useState("");
  const [user2, setUser2] = useState("");
  const router = useRouter();

  const handleCompare = () => {
    if (!user1.trim() || !user2.trim()) return;

    router.push(`/compare?user1=${user1.trim()}&user2=${user2.trim()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="rounded-2xl bg-transparent">
        <h3 className="text-2xl font-bold mb-4 text-gray-100 text-center">
          Compare Two Users
        </h3>
        <p className="text-sm text-gray-400 mb-6 text-center">
          Enter two GitHub usernames to compare their profiles side by side
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              First User
            </label>
            <input
              type="text"
              placeholder="Enter GitHub username"
              value={user1}
              onChange={(e) => setUser1(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCompare()}
              className="w-full border border-gray-600 rounded-lg px-4 py-3 bg-gray-900/50 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="flex items-center justify-center my-2">
            <div className="text-2xl text-gray-500">VS</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Second User
            </label>
            <input
              type="text"
              placeholder="Enter GitHub username"
              value={user2}
              onChange={(e) => setUser2(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCompare()}
              className="w-full border border-gray-600 rounded-lg px-4 py-3 bg-gray-900/50 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <button
            onClick={handleCompare}
            disabled={!user1.trim() || !user2.trim()}
            className="w-full bg-gray-900/50 border border-gray-600 text-gray-100 px-6 py-3 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition hover:bg-gray-800/60 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            Compare Users
          </button>
        </div>
      </div>
    </motion.div>
  );
}
