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
  const [hoveredRepo, setHoveredRepo] = useState<string | null>(null);

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

  const displayRepos = filteredRepos.slice(0, 15);

  // SVG dimensions
  const width = 600;
  const height = 400;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.35;

  const getNodeSize = (repo: Repo) => {
    const total = repo.stargazers_count + repo.forks_count;
    if (total > 100) return 24;
    if (total > 50) return 20;
    if (total > 20) return 16;
    return 12;
  };

  const getNodeColor = (lang: string) => {
    const colors: Record<string, string> = {
      JavaScript: "#facc15",
      TypeScript: "#3b82f6",
      Python: "#22c55e",
      Java: "#f97316",
      "C++": "#06b6d4",
      Go: "#0ea5e9",
      Rust: "#ef4444",
      Ruby: "#dc2626",
      PHP: "#8b5cf6",
      Swift: "#f59e0b",
      Kotlin: "#a855f7",
      Unknown: "#6b7280",
    };
    return colors[lang] || "#8b5cf6";
  };

  const getNodePosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
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
              {lang} ({reposByLanguage[lang].length})
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto"
          style={{ minHeight: "400px" }}
        >
          <defs>
            <radialGradient id="centerGradient">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background circles */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius * 0.3}
            fill="none"
            stroke="#374151"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.3"
          />
          <circle
            cx={centerX}
            cy={centerY}
            r={radius * 0.6}
            fill="none"
            stroke="#374151"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.3"
          />
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="#374151"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.3"
          />

          {/* Connection lines to center */}
          {displayRepos.map((repo, i) => {
            const pos = getNodePosition(i, displayRepos.length);
            const isHovered = hoveredRepo === repo.name;
            return (
              <motion.line
                key={`line-center-${repo.name}`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: isHovered ? 0.8 : 0.2 }}
                transition={{ delay: i * 0.03, duration: 0.5 }}
                x1={centerX}
                y1={centerY}
                x2={pos.x}
                y2={pos.y}
                stroke={isHovered ? getNodeColor(repo.language || "Unknown") : "#4b5563"}
                strokeWidth={isHovered ? "2" : "1"}
              />
            );
          })}

          {/* Connection lines between adjacent nodes */}
          {displayRepos.map((repo, i) => {
            const pos = getNodePosition(i, displayRepos.length);
            const nextPos = getNodePosition(
              (i + 1) % displayRepos.length,
              displayRepos.length
            );
            return (
              <motion.line
                key={`line-${repo.name}`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.15 }}
                transition={{ delay: i * 0.03 + 0.3, duration: 0.5 }}
                x1={pos.x}
                y1={pos.y}
                x2={nextPos.x}
                y2={nextPos.y}
                stroke="#6b7280"
                strokeWidth="1"
              />
            );
          })}

          {/* Repository nodes */}
          {displayRepos.map((repo, i) => {
            const pos = getNodePosition(i, displayRepos.length);
            const size = getNodeSize(repo);
            const color = getNodeColor(repo.language || "Unknown");
            const isHovered = hoveredRepo === repo.name;

            return (
              <g key={repo.name}>
                <motion.circle
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.05, type: "spring", stiffness: 200 }}
                  cx={pos.x}
                  cy={pos.y}
                  r={isHovered ? size * 1.3 : size}
                  fill={color}
                  stroke="#1f2937"
                  strokeWidth="2"
                  style={{ cursor: "pointer" }}
                  filter={isHovered ? "url(#glow)" : undefined}
                  onMouseEnter={() => setHoveredRepo(repo.name)}
                  onMouseLeave={() => setHoveredRepo(null)}
                />
                {isHovered && (
                  <motion.g
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <rect
                      x={pos.x - 80}
                      y={pos.y - size - 50}
                      width="160"
                      height="45"
                      fill="#1f2937"
                      stroke="#374151"
                      strokeWidth="1"
                      rx="6"
                    />
                    <text
                      x={pos.x}
                      y={pos.y - size - 32}
                      textAnchor="middle"
                      fill="#f3f4f6"
                      fontSize="11"
                      fontWeight="600"
                    >
                      {repo.name.length > 20
                        ? repo.name.substring(0, 20) + "..."
                        : repo.name}
                    </text>
                    <text
                      x={pos.x}
                      y={pos.y - size - 18}
                      textAnchor="middle"
                      fill="#9ca3af"
                      fontSize="9"
                    >
                      ⭐ {repo.stargazers_count} 🍴 {repo.forks_count}
                    </text>
                  </motion.g>
                )}
              </g>
            );
          })}

          {/* Center node */}
          <motion.g
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 150 }}
          >
            <circle
              cx={centerX}
              cy={centerY}
              r="40"
              fill="url(#centerGradient)"
              stroke="#1f2937"
              strokeWidth="3"
              filter="url(#glow)"
            />
            <text
              x={centerX}
              y={centerY - 5}
              textAnchor="middle"
              fill="white"
              fontSize="20"
              fontWeight="bold"
            >
              {displayRepos.length}
            </text>
            <text
              x={centerX}
              y={centerY + 12}
              textAnchor="middle"
              fill="#e0e7ff"
              fontSize="10"
            >
              repos
            </text>
          </motion.g>
        </svg>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-3 justify-center">
          {languages.slice(0, 8).map((lang) => (
            <div key={lang} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getNodeColor(lang) }}
              />
              <span className="text-xs text-gray-400">{lang}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}