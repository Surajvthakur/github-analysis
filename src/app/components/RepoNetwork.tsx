"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface Repo {
  name: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
}

interface RepoNetworkProps {
  repos: Repo[];
}

export default function RepoNetwork({ repos }: RepoNetworkProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  // Group repos by language
  const reposByLanguage: Record<string, Repo[]> = {};
  repos.forEach((repo) => {
    const lang = repo.language || "Unknown";
    if (!reposByLanguage[lang]) {
      reposByLanguage[lang] = [];
    }
    reposByLanguage[lang].push(repo);
  });

  const languages = Object.keys(reposByLanguage).sort(
    (a, b) => reposByLanguage[b].length - reposByLanguage[a].length
  );

  const filteredRepos = selectedLanguage
    ? reposByLanguage[selectedLanguage]
    : repos.slice(0, 20);

  const getNodeSize = (repo: Repo) => {
    const total = repo.stargazers_count + repo.forks_count;
    if (total > 100) return 60;
    if (total > 50) return 50;
    if (total > 20) return 40;
    return 30;
  };

  const getNodeColor = (repo: Repo) => {
    const lang = repo.language || "Unknown";
    const colors: Record<string, string> = {
      JavaScript: "#facc15",
      TypeScript: "#3b82f6",
      Python: "#22c55e",
      Java: "#f97316",
      "C++": "#06b6d4",
      Go: "#0ea5e9",
      Rust: "#ef4444",
      Unknown: "#6b7280",
    };
    return colors[lang] || "#8b5cf6";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-100">Repository Network</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedLanguage(null)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              selectedLanguage === null
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            All
          </button>
          {languages.slice(0, 6).map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                selectedLanguage === lang
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-96 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 overflow-hidden border border-gray-700">
        <svg className="absolute inset-0 w-full h-full">
          {/* Connection lines */}
          {filteredRepos.slice(0, 15).map((repo, i) => {
            const angle = (i / filteredRepos.length) * 2 * Math.PI;
            const radius = 120;
            const centerX = 200;
            const centerY = 180;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            if (i > 0) {
              const prevAngle = ((i - 1) / filteredRepos.length) * 2 * Math.PI;
              const prevX = centerX + radius * Math.cos(prevAngle);
              const prevY = centerY + radius * Math.sin(prevAngle);
              return (
                <line
                  key={`line-${i}`}
                  x1={prevX}
                  y1={prevY}
                  x2={x}
                  y2={y}
                  stroke="#4b5563"
                  strokeWidth="1"
                  opacity={0.3}
                />
              );
            }
            return null;
          })}
        </svg>

        <div className="relative z-10 flex flex-wrap justify-center items-center gap-4">
          {filteredRepos.slice(0, 15).map((repo, i) => {
            const angle = (i / filteredRepos.length) * 2 * Math.PI;
            const radius = 120;
            const centerX = 200;
            const centerY = 180;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            const size = getNodeSize(repo);
            const color = getNodeColor(repo);

            return (
              <motion.div
                key={repo.name}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.2, zIndex: 10 }}
                className="absolute"
                style={{
                  left: `${(x / 400) * 100}%`,
                  top: `${(y / 360) * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  className="rounded-full shadow-lg border-2 border-gray-800 cursor-pointer flex items-center justify-center text-white font-bold text-xs"
                  style={{
                    width: size,
                    height: size,
                    backgroundColor: color,
                  }}
                  title={`${repo.name}\n⭐ ${repo.stargazers_count} 🍴 ${repo.forks_count}`}
                >
                  {repo.name.substring(0, 2).toUpperCase()}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Center node */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-xl border-4 border-white dark:border-gray-800 flex items-center justify-center text-white font-bold"
        >
          {filteredRepos.length}
        </motion.div>
      </div>
    </motion.div>
  );
}
