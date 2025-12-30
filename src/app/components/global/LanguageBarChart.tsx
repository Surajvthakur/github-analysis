"use client";

import { motion } from "framer-motion";
import { formatNumber } from "@/lib/format";

interface LanguageStat {
    language: string;
    repoCount: number;
    totalStars: number;
}

interface LanguageBarChartProps {
    languages: LanguageStat[];
}

const COLORS = [
    "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981",
    "#06b6d4", "#f43f5e", "#a855f7", "#14b8a6", "#f97316",
];

export default function LanguageBarChart({ languages }: LanguageBarChartProps) {
    const topLanguages = languages.slice(0, 10);
    const maxRepos = Math.max(...topLanguages.map(l => l.repoCount), 1);

    return (
        <div className="space-y-3">
            {topLanguages.map((lang, index) => {
                const percentage = (lang.repoCount / maxRepos) * 100;
                const color = COLORS[index % COLORS.length];

                return (
                    <motion.div
                        key={lang.language}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className="group"
                    >
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: color }}
                                />
                                <span className="font-medium text-sm text-gray-200">
                                    {lang.language}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                                <span>{formatNumber(lang.repoCount)} repos</span>
                                <span className="text-yellow-400">⭐ {formatNumber(lang.totalStars)}</span>
                            </div>
                        </div>
                        <div className="relative h-6 bg-gray-800/50 rounded-lg overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ delay: index * 0.05 + 0.2, duration: 0.5, ease: "easeOut" }}
                                className="h-full rounded-lg relative overflow-hidden"
                                style={{
                                    background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                                }}
                            >
                                <div
                                    className="absolute inset-0 opacity-30"
                                    style={{
                                        background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`,
                                        animation: 'shimmer 2s infinite',
                                    }}
                                />
                            </motion.div>
                            {/* Percentage label inside bar */}
                            {percentage > 15 && (
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white/90">
                                    {Math.round(percentage)}%
                                </span>
                            )}
                        </div>
                    </motion.div>
                );
            })}

            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}
