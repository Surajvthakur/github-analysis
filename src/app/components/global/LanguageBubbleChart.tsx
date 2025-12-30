"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface Language {
    name?: string;
    language?: string;
    repoCount: number;
    totalBytes?: number;
    totalStars?: number;
    percentage?: number;
}

interface LanguageBubbleChartProps {
    languages: Language[];
}

export default function LanguageBubbleChart({ languages }: LanguageBubbleChartProps) {
    const [hoveredLang, setHoveredLang] = useState<string | null>(null);

    // Filter out invalid entries and take top 20
    // Handle both 'name' and 'language' field names
    const topLanguages = languages
        .filter(lang => lang && (lang.name || lang.language))
        .map(lang => ({
            displayName: lang.name || lang.language || 'Unknown',
            value: lang.totalBytes || lang.totalStars || lang.repoCount || 0,
            repoCount: lang.repoCount || 0,
            percentage: lang.percentage || 0,
        }))
        .slice(0, 20);

    const getLanguageColor = (index: number) => {
        const colors = [
            "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981",
            "#06b6d4", "#f43f5e", "#a855f7", "#14b8a6", "#f97316",
            "#6366f1", "#84cc16", "#22c55e", "#eab308", "#ef4444",
            "#0ea5e9", "#d946ef", "#facc15", "#2dd4bf", "#fb923c"
        ];
        return colors[index % colors.length];
    };

    const getBubbleSize = (value: number, maxValue: number) => {
        if (maxValue === 0) return 50;
        const minSize = 40;
        const maxSize = 120;
        const normalized = value / maxValue;
        return minSize + (maxSize - minSize) * Math.sqrt(normalized);
    };

    const maxValue = Math.max(...topLanguages.map(l => l.value), 1);

    // Create positions that don't overlap - arrange in a larger circle
    const positions = topLanguages.map((lang, i) => {
        const totalItems = topLanguages.length;
        const angle = (i / totalItems) * 2 * Math.PI - Math.PI / 2; // Start from top
        // Use a fixed radius that spreads items out more
        const radius = 200;
        return {
            x: 400 + radius * Math.cos(angle),
            y: 280 + radius * Math.sin(angle) * 0.8, // Slightly elliptical for better fit
        };
    });

    return (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
            <svg
                viewBox="0 0 800 560"
                className="w-full h-auto"
                style={{ minHeight: "500px" }}
            >
                <defs>
                    {topLanguages.map((lang, i) => (
                        <radialGradient key={`gradient-${lang.displayName}-${i}`} id={`gradient-${i}`}>
                            <stop offset="0%" stopColor={getLanguageColor(i)} stopOpacity="0.8" />
                            <stop offset="100%" stopColor={getLanguageColor(i)} stopOpacity="0.4" />
                        </radialGradient>
                    ))}
                    <filter id="bubble-glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Connection lines to center */}
                {topLanguages.map((lang, i) => {
                    const isHovered = hoveredLang === lang.displayName;
                    return (
                        <motion.line
                            key={`line-${lang.displayName}-${i}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isHovered ? 0.3 : 0.1 }}
                            x1={400}
                            y1={280}
                            x2={positions[i].x}
                            y2={positions[i].y}
                            stroke={getLanguageColor(i)}
                            strokeWidth="1"
                            strokeDasharray="4 4"
                        />
                    );
                })}

                {/* Bubbles */}
                {topLanguages.map((lang, i) => {
                    const size = getBubbleSize(lang.value, maxValue);
                    const isHovered = hoveredLang === lang.displayName;

                    return (
                        <g key={`bubble-${lang.displayName}-${i}`}>
                            <motion.circle
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: i * 0.05, type: "spring" }}
                                cx={positions[i].x}
                                cy={positions[i].y}
                                r={isHovered ? size * 1.15 : size}
                                fill={`url(#gradient-${i})`}
                                stroke={getLanguageColor(i)}
                                strokeWidth={isHovered ? "3" : "2"}
                                style={{ cursor: "pointer" }}
                                filter={isHovered ? "url(#bubble-glow)" : undefined}
                                onMouseEnter={() => setHoveredLang(lang.displayName)}
                                onMouseLeave={() => setHoveredLang(null)}
                            />

                            {/* Language name inside bubble */}
                            <text
                                x={positions[i].x}
                                y={positions[i].y - 5}
                                textAnchor="middle"
                                fill="white"
                                fontSize={size > 70 ? "14" : "11"}
                                fontWeight="600"
                                pointerEvents="none"
                            >
                                {lang.displayName}
                            </text>

                            {/* Repo count */}
                            <text
                                x={positions[i].x}
                                y={positions[i].y + 10}
                                textAnchor="middle"
                                fill="rgba(255,255,255,0.7)"
                                fontSize={size > 70 ? "11" : "9"}
                                pointerEvents="none"
                            >
                                {lang.repoCount.toLocaleString()}
                            </text>

                            {/* Hover tooltip */}
                            {isHovered && (
                                <motion.g
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <rect
                                        x={positions[i].x - 70}
                                        y={positions[i].y - size - 60}
                                        width="140"
                                        height="50"
                                        fill="#1f2937"
                                        stroke={getLanguageColor(i)}
                                        strokeWidth="2"
                                        rx="8"
                                    />
                                    <text
                                        x={positions[i].x}
                                        y={positions[i].y - size - 42}
                                        textAnchor="middle"
                                        fill="#f3f4f6"
                                        fontSize="12"
                                        fontWeight="600"
                                    >
                                        {lang.displayName}
                                    </text>
                                    <text
                                        x={positions[i].x}
                                        y={positions[i].y - size - 28}
                                        textAnchor="middle"
                                        fill="#9ca3af"
                                        fontSize="10"
                                    >
                                        {lang.repoCount.toLocaleString()} repos
                                    </text>
                                    <text
                                        x={positions[i].x}
                                        y={positions[i].y - size - 16}
                                        textAnchor="middle"
                                        fill="#9ca3af"
                                        fontSize="10"
                                    >
                                        {lang.value.toLocaleString()} stars
                                    </text>
                                </motion.g>
                            )}
                        </g>
                    );
                })}

                {/* Center label */}
                <circle cx={400} cy={280} r={35} fill="#1f2937" stroke="#374151" strokeWidth="2" />
                <text
                    x={400}
                    y={275}
                    textAnchor="middle"
                    fill="white"
                    fontSize="12"
                    fontWeight="600"
                >
                    Languages
                </text>
                <text
                    x={400}
                    y={290}
                    textAnchor="middle"
                    fill="#9ca3af"
                    fontSize="10"
                >
                    Ecosystem
                </text>
            </svg>
        </div>
    );
}