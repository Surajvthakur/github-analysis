"use client";

import { motion } from "framer-motion";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from "recharts";

interface Language {
    name?: string;
    language?: string;
    repoCount: number;
    totalBytes?: number;
    totalStars?: number;
    percentage?: number;
}

interface LanguageTrendChartProps {
    languages: Language[];
}

export default function LanguageTrendChart({ languages }: LanguageTrendChartProps) {
    // Filter out invalid entries and take top 20
    // Handle both 'name' and 'language' field names
    const topLanguages = languages
        .filter(lang => lang && (lang.name || lang.language))
        .slice(0, 20);

    const scatterData = topLanguages.map((lang, i) => ({
        name: lang.name || lang.language || 'Unknown',
        x: lang.repoCount || 0,
        y: (lang.totalBytes || lang.totalStars || 0) / 1000, // Convert to K
        z: (lang.percentage || lang.repoCount || 1) * 100, // For bubble size
        color: getLanguageColor(i)
    }));

    function getLanguageColor(index: number) {
        const colors = [
            "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981",
            "#06b6d4", "#f43f5e", "#a855f7", "#14b8a6", "#f97316",
            "#6366f1", "#84cc16", "#22c55e", "#eab308", "#ef4444",
            "#0ea5e9", "#d946ef", "#facc15", "#2dd4bf", "#fb923c"
        ];
        return colors[index % colors.length];
    }

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-xl">
                    <p className="font-bold text-white mb-2">{data.name}</p>
                    <p className="text-sm text-gray-300">
                        Repositories: <span className="font-semibold text-blue-400">{data.x.toLocaleString()}</span>
                    </p>
                    <p className="text-sm text-gray-300">
                        Code Size: <span className="font-semibold text-purple-400">{data.y.toFixed(1)} MB</span>
                    </p>
                    <p className="text-sm text-gray-300">
                        Share: <span className="font-semibold text-green-400">{(data.z / 100).toFixed(2)}%</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700"
        >
            <ResponsiveContainer width="100%" height={500}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                        type="number"
                        dataKey="x"
                        name="Repository Count"
                        stroke="#9ca3af"
                        label={{
                            value: 'Repository Count',
                            position: 'bottom',
                            offset: 40,
                            style: { fill: '#9ca3af', fontSize: 14, fontWeight: 600 }
                        }}
                        tick={{ fill: '#9ca3af' }}
                    />
                    <YAxis
                        type="number"
                        dataKey="y"
                        name="Code Size (MB)"
                        stroke="#9ca3af"
                        label={{
                            value: 'Code Size (MB)',
                            angle: -90,
                            position: 'insideLeft',
                            style: { fill: '#9ca3af', fontSize: 14, fontWeight: 600 }
                        }}
                        tick={{ fill: '#9ca3af' }}
                    />
                    <ZAxis type="number" dataKey="z" range={[200, 2000]} />
                    <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                    {scatterData.map((entry, index) => (
                        <Scatter
                            key={`scatter-${entry.name}-${index}`}
                            data={[entry]}
                            fill={entry.color}
                            shape="circle"
                            animationBegin={index * 50}
                            animationDuration={800}
                        />
                    ))}
                </ScatterChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                    <span className="text-xs text-gray-400">Bubble size = Market share</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-gray-500" />
                    <span className="text-xs text-gray-400">X-axis = Repository count</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-gray-500" />
                    <span className="text-xs text-gray-400">Y-axis = Total code size</span>
                </div>
            </div>
        </motion.div>
    );
}