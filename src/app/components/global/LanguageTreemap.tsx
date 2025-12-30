"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatNumber } from "@/lib/format";

interface Language {
    name?: string;
    language?: string;
    repoCount: number;
    totalStars?: number;
    totalBytes?: number;
    percentage?: number;
}

interface LanguageTreemapProps {
    languages: Language[];
}

interface TreemapNode {
    name: string;
    repoCount: number;
    stars: number;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
}

const COLORS = [
    "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981",
    "#06b6d4", "#f43f5e", "#a855f7", "#14b8a6", "#f97316",
];

export default function LanguageTreemap({ languages }: LanguageTreemapProps) {
    const [hoveredLang, setHoveredLang] = useState<TreemapNode | null>(null);

    const nodes = useMemo(() => {
        const width = 800;
        const height = 500;

        // 1. Normalize and Sort Data
        const data = languages
            .map((lang) => ({
                name: lang.name || lang.language || "Unknown",
                repoCount: lang.repoCount || 0,
                stars: lang.totalStars || 0,
                // We use stars (or repoCount) as the 'weight' for area calculation
                weight: lang.totalStars || lang.repoCount || 1,
            }))
            .sort((a, b) => b.weight - a.weight)
            .slice(0, 15);

        const totalWeight = data.reduce((sum, item) => sum + item.weight, 0);
        const treemapNodes: TreemapNode[] = [];

        // 2. Recursive Squarified-lite Partitioning
        const partition = (
            items: typeof data,
            x: number,
            y: number,
            w: number,
            h: number,
            colorOffset: number
        ) => {
            if (items.length === 0) return;

            if (items.length === 1) {
                treemapNodes.push({
                    ...items[0],
                    x, y, width: w, height: h,
                    color: COLORS[(colorOffset) % COLORS.length],
                });
                return;
            }

            // Split items into two groups
            const halfIndex = Math.ceil(items.length / 2);
            const firstPart = items.slice(0, halfIndex);
            const secondPart = items.slice(halfIndex);

            const firstWeight = firstPart.reduce((sum, item) => sum + item.weight, 0);
            const totalPartWeight = items.reduce((sum, item) => sum + item.weight, 0);
            const ratio = firstWeight / totalPartWeight;

            if (w > h) {
                // Split horizontally
                const currentW = w * ratio;
                partition(firstPart, x, y, currentW, h, colorOffset);
                partition(secondPart, x + currentW, y, w - currentW, h, colorOffset + halfIndex);
            } else {
                // Split vertically
                const currentH = h * ratio;
                partition(firstPart, x, y, w, currentH, colorOffset);
                partition(secondPart, x, y + currentH, w, h - currentH, colorOffset + halfIndex);
            }
        };

        partition(data, 0, 0, width, height, 0);
        return treemapNodes;
    }, [languages]);

    if (!nodes.length) return <div className="p-8 text-center text-gray-500">No data available</div>;

    return (
        <div className="relative w-full bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-2xl overflow-hidden">
            <svg
                viewBox="0 0 800 500"
                className="w-full h-auto"
                style={{ borderRadius: "8px" }}
            >
                {nodes.map((node, i) => {
                    const isHovered = hoveredLang?.name === node.name;
                    const showText = node.width > 70 && node.height > 40;

                    return (
                        <g
                            key={node.name}
                            onMouseEnter={() => setHoveredLang(node.name === hoveredLang?.name ? hoveredLang : node)}
                            onMouseLeave={() => setHoveredLang(null)}
                            style={{ cursor: "pointer" }}
                        >
                            <motion.rect
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    fill: isHovered ? node.color : node.color,
                                    fillOpacity: isHovered ? 1 : 0.8
                                }}
                                x={node.x + 2}
                                y={node.y + 2}
                                width={Math.max(0, node.width - 4)}
                                height={Math.max(0, node.height - 4)}
                                rx={6}
                                stroke={isHovered ? "#fff" : "transparent"}
                                strokeWidth={2}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            />

                            {showText && (
                                <foreignObject
                                    x={node.x + 6}
                                    y={node.y + 6}
                                    width={node.width - 12}
                                    height={node.height - 12}
                                    className="pointer-events-none"
                                >
                                    <div className="flex flex-col items-center justify-center h-full text-white overflow-hidden text-center">
                                        <p className="font-bold text-sm sm:text-base truncate w-full">
                                            {node.name}
                                        </p>
                                        {node.height > 70 && (
                                            <div className="mt-1 space-y-0.5 opacity-90">
                                                <p className="text-[10px] whitespace-nowrap">
                                                    {formatNumber(node.repoCount)} repos
                                                </p>
                                                <p className="text-[10px] font-medium text-blue-100">
                                                    {formatNumber(node.stars)} stars
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </foreignObject>
                            )}
                        </g>
                    );
                })}
            </svg>

            {/* Dynamic Tooltip for small items or extra detail */}
            <AnimatePresence>
                {hoveredLang && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-6 left-6 bg-slate-900/95 border border-slate-700 p-3 rounded-lg shadow-xl backdrop-blur-md pointer-events-none"
                    >
                        <p className="font-bold text-white text-lg">{hoveredLang.name}</p>
                        <div className="flex gap-4 mt-1">
                            <div className="text-xs text-slate-400">
                                <span className="block text-slate-200 font-semibold">{formatNumber(hoveredLang.repoCount)}</span>
                                Repositories
                            </div>
                            <div className="text-xs text-slate-400">
                                <span className="block text-slate-200 font-semibold">{formatNumber(hoveredLang.stars)}</span>
                                Total Stars
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}