"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface Language {
    name: string;
    repoCount: number;
    totalBytes: number;
    percentage: number;
}

interface LanguageTreemapProps {
    languages: Language[];
}

interface TreemapNode {
    name: string;
    value: number;
    repoCount: number;
    percentage: number;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
}

export default function LanguageTreemap({ languages }: LanguageTreemapProps) {
    const [hoveredLang, setHoveredLang] = useState<string | null>(null);

    // Filter out invalid entries and take top 15
    const topLanguages = languages
        .filter(lang => lang && lang.name && lang.totalBytes > 0)
        .slice(0, 15);

    const getLanguageColor = (index: number) => {
        const colors = [
            "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981",
            "#06b6d4", "#f43f5e", "#a855f7", "#14b8a6", "#f97316",
            "#6366f1", "#84cc16", "#22c55e", "#eab308", "#ef4444"
        ];
        return colors[index % colors.length];
    };

    // Simple treemap layout algorithm (squarified)
    const createTreemap = (): TreemapNode[] => {
        const width = 800;
        const height = 500;
        const totalValue = topLanguages.reduce((sum, lang) => sum + lang.totalBytes, 0);

        const nodes: TreemapNode[] = [];
        let currentX = 0;
        let currentY = 0;
        let rowHeight = 0;
        let rowWidth = 0;

        topLanguages.forEach((lang, i) => {
            const area = (lang.totalBytes / totalValue) * (width * height);
            const nodeWidth = Math.sqrt(area * (width / height));
            const nodeHeight = area / nodeWidth;

            if (currentX + nodeWidth > width && currentX > 0) {
                currentY += rowHeight;
                currentX = 0;
                rowHeight = 0;
                rowWidth = 0;
            }

            nodes.push({
                name: lang.name,
                value: lang.totalBytes,
                repoCount: lang.repoCount,
                percentage: lang.percentage,
                x: currentX,
                y: currentY,
                width: nodeWidth,
                height: nodeHeight,
                color: getLanguageColor(i)
            });

            currentX += nodeWidth;
            rowHeight = Math.max(rowHeight, nodeHeight);
            rowWidth += nodeWidth;
        });

        return nodes;
    };

    const nodes = createTreemap();

    return (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
            <svg
                viewBox="0 0 800 500"
                className="w-full h-auto"
                style={{ minHeight: "500px" }}
            >
                <defs>
                    {nodes.map((node, i) => (
                        <linearGradient key={`treemap-gradient-${node.name}-${i}`} id={`treemap-gradient-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={node.color} stopOpacity="0.9" />
                            <stop offset="100%" stopColor={node.color} stopOpacity="0.6" />
                        </linearGradient>
                    ))}
                    <filter id="treemap-shadow">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
                    </filter>
                </defs>

                {nodes.map((node, i) => {
                    const isHovered = hoveredLang === node.name;
                    const fontSize = Math.min(node.width, node.height) / 8;
                    const showDetails = node.width > 80 && node.height > 60;

                    return (
                        <g key={`treemap-${node.name}-${i}`}>
                            <motion.rect
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{
                                    opacity: 1,
                                    scale: isHovered ? 0.98 : 1,
                                    x: node.x,
                                    y: node.y
                                }}
                                transition={{ delay: i * 0.03, type: "spring", stiffness: 200 }}
                                x={node.x}
                                y={node.y}
                                width={node.width}
                                height={node.height}
                                fill={`url(#treemap-gradient-${i})`}
                                stroke={isHovered ? "#ffffff" : "#1f2937"}
                                strokeWidth={isHovered ? "3" : "2"}
                                rx="8"
                                style={{ cursor: "pointer" }}
                                filter={isHovered ? "url(#treemap-shadow)" : undefined}
                                onMouseEnter={() => setHoveredLang(node.name)}
                                onMouseLeave={() => setHoveredLang(null)}
                            />

                            {/* Language name */}
                            <text
                                x={node.x + node.width / 2}
                                y={node.y + node.height / 2 - (showDetails ? fontSize / 2 : 0)}
                                textAnchor="middle"
                                fill="white"
                                fontSize={Math.max(Math.min(fontSize, 18), 10)}
                                fontWeight="700"
                                pointerEvents="none"
                            >
                                {node.name && node.name.length > 15 ? node.name.substring(0, 12) + "..." : (node.name || '')}
                            </text>

                            {/* Details when space allows */}
                            {showDetails && (
                                <>
                                    <text
                                        x={node.x + node.width / 2}
                                        y={node.y + node.height / 2 + fontSize}
                                        textAnchor="middle"
                                        fill="rgba(255,255,255,0.8)"
                                        fontSize={Math.max(fontSize * 0.6, 10)}
                                        pointerEvents="none"
                                    >
                                        {node.percentage.toFixed(1)}%
                                    </text>
                                    <text
                                        x={node.x + node.width / 2}
                                        y={node.y + node.height / 2 + fontSize * 1.8}
                                        textAnchor="middle"
                                        fill="rgba(255,255,255,0.6)"
                                        fontSize={Math.max(fontSize * 0.5, 9)}
                                        pointerEvents="none"
                                    >
                                        {(node.value / 1000000).toFixed(1)}MB
                                    </text>
                                </>
                            )}

                            {/* Hover overlay */}
                            {isHovered && (
                                <motion.g
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <rect
                                        x={node.x + 10}
                                        y={node.y + 10}
                                        width={Math.min(node.width - 20, 180)}
                                        height="80"
                                        fill="#000000"
                                        fillOpacity="0.9"
                                        stroke={node.color}
                                        strokeWidth="2"
                                        rx="8"
                                    />
                                    <text
                                        x={node.x + 20}
                                        y={node.y + 32}
                                        fill="#f3f4f6"
                                        fontSize="14"
                                        fontWeight="600"
                                    >
                                        {node.name}
                                    </text>
                                    <text
                                        x={node.x + 20}
                                        y={node.y + 50}
                                        fill="#9ca3af"
                                        fontSize="11"
                                    >
                                        Size: {(node.value / 1000000).toFixed(2)} MB
                                    </text>
                                    <text
                                        x={node.x + 20}
                                        y={node.y + 66}
                                        fill="#9ca3af"
                                        fontSize="11"
                                    >
                                        Repos: {node.repoCount.toLocaleString()}
                                    </text>
                                    <text
                                        x={node.x + 20}
                                        y={node.y + 82}
                                        fill="#9ca3af"
                                        fontSize="11"
                                    >
                                        Share: {node.percentage.toFixed(2)}%
                                    </text>
                                </motion.g>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}