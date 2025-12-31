"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts";

interface Language {
    name?: string;
    language?: string;
    repoCount: number;
    totalBytes?: number;
    totalStars?: number;
    percentage?: number;
}

interface LanguageRadarComparisonProps {
    languages: Language[];
}

export default function LanguageRadarComparison({ languages }: LanguageRadarComparisonProps) {
    // Normalize language data to have consistent property names
    const normalizedLanguages = languages
        .filter(lang => lang && (lang.name || lang.language))
        .map(lang => ({
            displayName: lang.name || lang.language || 'Unknown',
            repoCount: lang.repoCount || 0,
            totalStars: lang.totalBytes || lang.totalStars || 0,
            percentage: lang.percentage || (lang.repoCount || 0),
        }));

    const topLanguages = normalizedLanguages.slice(0, 10);

    const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
        topLanguages.slice(0, 4).map(l => l.displayName)
    );

    const toggleLanguage = (name: string) => {
        if (selectedLanguages.includes(name)) {
            setSelectedLanguages(selectedLanguages.filter(l => l !== name));
        } else if (selectedLanguages.length < 5) {
            setSelectedLanguages([...selectedLanguages, name]);
        }
    };

    const getLanguageColor = (name: string) => {
        const colors: string[] = [
            "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981",
            "#06b6d4", "#f43f5e", "#a855f7", "#14b8a6", "#f97316",
        ];
        const index = topLanguages.findIndex(l => l.displayName === name);
        return colors[index >= 0 ? index : 0] || "#6b7280";
    };

    // Normalize data for radar chart
    const maxRepoCount = Math.max(...normalizedLanguages.map(l => l.repoCount), 1);
    const maxStars = Math.max(...normalizedLanguages.map(l => l.totalStars), 1);
    const maxPercentage = Math.max(...normalizedLanguages.map(l => l.percentage), 1);

    const radarData = [
        {
            metric: "Repository Count",
            ...Object.fromEntries(
                selectedLanguages.map(name => {
                    const lang = normalizedLanguages.find(l => l.displayName === name);
                    return [name, lang ? (lang.repoCount / maxRepoCount) * 100 : 0];
                })
            )
        },
        {
            metric: "Total Stars",
            ...Object.fromEntries(
                selectedLanguages.map(name => {
                    const lang = normalizedLanguages.find(l => l.displayName === name);
                    return [name, lang ? (lang.totalStars / maxStars) * 100 : 0];
                })
            )
        },
        {
            metric: "Popularity",
            ...Object.fromEntries(
                selectedLanguages.map(name => {
                    const lang = normalizedLanguages.find(l => l.displayName === name);
                    return [name, lang ? (lang.percentage / maxPercentage) * 100 : 0];
                })
            )
        },
        {
            metric: "Avg Stars/Repo",
            ...Object.fromEntries(
                selectedLanguages.map(name => {
                    const lang = normalizedLanguages.find(l => l.displayName === name);
                    const avgStars = lang && lang.repoCount > 0 ? lang.totalStars / lang.repoCount : 0;
                    const maxAvg = Math.max(...normalizedLanguages.filter(l => l.repoCount > 0).map(l => l.totalStars / l.repoCount), 1);
                    return [name, (avgStars / maxAvg) * 100];
                })
            )
        },
        {
            metric: "Ranking Index",
            ...Object.fromEntries(
                selectedLanguages.map(name => {
                    const index = normalizedLanguages.findIndex(l => l.displayName === name);
                    return [name, index >= 0 ? Math.max(100 - (index * 10), 10) : 0];
                })
            )
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="border-gray-700"
        >
            {/* Language selector */}
            <div className="my-2">
                <br />
                <p className="text-sm text-gray-400 my-6 text-center font-bold">
                    Select up to 5 languages to compare (currently {selectedLanguages.length}/5):
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                    {topLanguages.map((lang, idx) => {
                        const isSelected = selectedLanguages.includes(lang.displayName);
                        return (
                            <button
                                key={`lang-${lang.displayName}-${idx}`}
                                onClick={() => toggleLanguage(lang.displayName)}
                                disabled={!isSelected && selectedLanguages.length >= 5}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isSelected
                                    ? "bg-linear-to-r text-white shadow-lg"
                                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                style={
                                    isSelected
                                        ? {
                                            background: `linear-gradient(135deg, ${getLanguageColor(lang.displayName)}, ${getLanguageColor(lang.displayName)}cc)`,
                                        }
                                        : undefined
                                }
                            >
                                {lang.displayName}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Radar Chart */}
            {selectedLanguages.length > 0 ? (
                <ResponsiveContainer width="100%" height={500}>
                    <RadarChart data={radarData}>
                        <PolarGrid stroke="#4b5563" />
                        <PolarAngleAxis
                            dataKey="metric"
                            tick={{ fill: "#9ca3af", fontSize: 12 }}
                        />
                        <PolarRadiusAxis
                            angle={90}
                            domain={[0, 100]}
                            tick={{ fill: "#9ca3af", fontSize: 10 }}
                        />
                        {selectedLanguages.map((name, idx) => (
                            <Radar
                                key={`radar-${name}-${idx}`}
                                name={name}
                                dataKey={name}
                                stroke={getLanguageColor(name)}
                                fill={getLanguageColor(name)}
                                fillOpacity={0.3}
                                strokeWidth={2}
                            />
                        ))}
                        <Legend
                            wrapperStyle={{ paddingTop: "20px" }}
                            iconType="circle"
                        />
                    </RadarChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-[500px] flex items-center justify-center text-gray-500">
                    <div className="text-center">
                        <p className="text-lg mb-2">No languages selected</p>
                        <p className="text-sm">Select at least one language to compare</p>
                    </div>
                </div>
            )}

            {/* Metrics explanation */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 max-w-lg mx-2.5">
                    <h4 className="text-sm font-semibold text-blue-400 mb-1">Repository Count</h4>
                    <p className="text-xs text-gray-400">Number of top repositories using this language</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 max-w-lg mx-2.5">
                    <h4 className="text-sm font-semibold text-purple-400 mb-1">Total Stars</h4>
                    <p className="text-xs text-gray-400">Combined stars from all repositories</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 max-w-lg mx-2.5">
                    <h4 className="text-sm font-semibold text-pink-400 mb-1">Popularity</h4>
                    <p className="text-xs text-gray-400">Overall popularity score</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 max-w-lg mx-2.5">
                    <h4 className="text-sm font-semibold text-orange-400 mb-1">Avg Stars/Repo</h4>
                    <p className="text-xs text-gray-400">Average stars per repository</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 max-w-lg mx-2.5">
                    <h4 className="text-sm font-semibold text-green-400 mb-1">Ranking Index</h4>
                    <p className="text-xs text-gray-400">Overall ranking position</p>
                </div>
            </div>
        </motion.div>
    );
}