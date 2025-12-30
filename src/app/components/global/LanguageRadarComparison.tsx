"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts";

interface Language {
    name: string;
    repoCount: number;
    totalBytes: number;
    percentage: number;
}

interface LanguageRadarComparisonProps {
    languages: Language[];
}

export default function LanguageRadarComparison({ languages }: LanguageRadarComparisonProps) {
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
        languages[0]?.name,
        languages[1]?.name,
        languages[2]?.name,
        languages[3]?.name
    ].filter(Boolean));

    // Filter out invalid entries and take top 10
    const topLanguages = languages
        .filter(lang => lang && lang.name)
        .slice(0, 10);

    const toggleLanguage = (name: string) => {
        if (selectedLanguages.includes(name)) {
            setSelectedLanguages(selectedLanguages.filter(l => l !== name));
        } else if (selectedLanguages.length < 5) {
            setSelectedLanguages([...selectedLanguages, name]);
        }
    };

    const getLanguageColor = (name: string) => {
        const colors: Record<string, string> = {
            [languages[0]?.name]: "#3b82f6",
            [languages[1]?.name]: "#8b5cf6",
            [languages[2]?.name]: "#ec4899",
            [languages[3]?.name]: "#f59e0b",
            [languages[4]?.name]: "#10b981",
            [languages[5]?.name]: "#06b6d4",
            [languages[6]?.name]: "#f43f5e",
            [languages[7]?.name]: "#a855f7",
            [languages[8]?.name]: "#14b8a6",
            [languages[9]?.name]: "#f97316",
        };
        return colors[name] || "#6b7280";
    };

    // Normalize data for radar chart
    const maxRepoCount = Math.max(...languages.map(l => l.repoCount));
    const maxBytes = Math.max(...languages.map(l => l.totalBytes));
    const maxPercentage = Math.max(...languages.map(l => l.percentage));

    const radarData = [
        {
            metric: "Repository Count",
            ...Object.fromEntries(
                selectedLanguages.map(name => {
                    const lang = languages.find(l => l.name === name);
                    return [name, lang ? (lang.repoCount / maxRepoCount) * 100 : 0];
                })
            )
        },
        {
            metric: "Code Volume",
            ...Object.fromEntries(
                selectedLanguages.map(name => {
                    const lang = languages.find(l => l.name === name);
                    return [name, lang ? (lang.totalBytes / maxBytes) * 100 : 0];
                })
            )
        },
        {
            metric: "Market Share",
            ...Object.fromEntries(
                selectedLanguages.map(name => {
                    const lang = languages.find(l => l.name === name);
                    return [name, lang ? (lang.percentage / maxPercentage) * 100 : 0];
                })
            )
        },
        {
            metric: "Avg Repo Size",
            ...Object.fromEntries(
                selectedLanguages.map(name => {
                    const lang = languages.find(l => l.name === name);
                    const avgSize = lang ? lang.totalBytes / lang.repoCount : 0;
                    const maxAvg = Math.max(...languages.map(l => l.totalBytes / l.repoCount));
                    return [name, (avgSize / maxAvg) * 100];
                })
            )
        },
        {
            metric: "Popularity Index",
            ...Object.fromEntries(
                selectedLanguages.map(name => {
                    const lang = languages.find(l => l.name === name);
                    const index = languages.findIndex(l => l.name === name);
                    return [name, lang ? 100 - (index * 10) : 0];
                })
            )
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700"
        >
            {/* Language selector */}
            <div className="mb-6">
                <p className="text-sm text-gray-400 mb-3">
                    Select up to 5 languages to compare (currently {selectedLanguages.length}/5):
                </p>
                <div className="flex flex-wrap gap-2">
                    {topLanguages.map((lang) => {
                        const isSelected = selectedLanguages.includes(lang.name);
                        return (
                            <button
                                key={`lang-${lang.name}-${topLanguages.indexOf(lang)}`}
                                onClick={() => toggleLanguage(lang.name)}
                                disabled={!isSelected && selectedLanguages.length >= 5}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isSelected
                                        ? "bg-gradient-to-r text-white shadow-lg"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                style={
                                    isSelected
                                        ? {
                                            background: `linear-gradient(135deg, ${getLanguageColor(lang.name)}, ${getLanguageColor(lang.name)}cc)`,
                                        }
                                        : undefined
                                }
                            >
                                {lang.name}
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
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                    <h4 className="text-sm font-semibold text-blue-400 mb-1">Repository Count</h4>
                    <p className="text-xs text-gray-400">Number of repositories using this language</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                    <h4 className="text-sm font-semibold text-purple-400 mb-1">Code Volume</h4>
                    <p className="text-xs text-gray-400">Total bytes of code written</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                    <h4 className="text-sm font-semibold text-pink-400 mb-1">Market Share</h4>
                    <p className="text-xs text-gray-400">Percentage of total codebase</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                    <h4 className="text-sm font-semibold text-orange-400 mb-1">Avg Repo Size</h4>
                    <p className="text-xs text-gray-400">Average code size per repository</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                    <h4 className="text-sm font-semibold text-green-400 mb-1">Popularity Index</h4>
                    <p className="text-xs text-gray-400">Overall ranking position</p>
                </div>
            </div>
        </motion.div>
    );
}