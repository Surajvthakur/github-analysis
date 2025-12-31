import LanguageOverview from "@/app/components/global/LanguageOverview";
import LanguageTable from "@/app/components/global/LanguageTable";
import LanguageBubbleChart from "@/app/components/global/LanguageBubbleChart";
import LanguageTreemap from "@/app/components/global/LanguageTreemap";
import LanguageTrendChart from "@/app/components/global/LanguageTrendChart";
import LanguageRadarComparison from "@/app/components/global/LanguageRadarComparison";
import { LiquidGlassCard } from "@/components/liquid-weather-glass";

async function getLanguages() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/global?type=languages`,
        { cache: 'no-store' } // Force fresh data
    );

    if (!res.ok) {
        throw new Error("Failed to fetch language analytics");
    }

    return res.json();
}

export default async function LanguagesPage() {
    const data = await getLanguages();

    return (
        <section className="space-y-14">
            {/* Header */}
            <header className="text-center mt-6">
                <h1 className="text-4xl font-bold mb-4">
                    🌍 Programming Language Analytics
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Analyze programming language popularity and ecosystem
                    dominance across GitHub repositories.
                </p>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-linear-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
                    <div className="text-3xl font-bold text-blue-400">
                        {data.languages.length}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">Total Languages</div>
                </div>
                <div className="bg-linear-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6">
                    <div className="text-3xl font-bold text-purple-400">
                        {data.languages.reduce((sum: number, lang: any) => sum + lang.repoCount, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">Total Repositories</div>
                </div>
                <div className="bg-linear-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6">
                    <div className="text-3xl font-bold text-green-400">
                        {data.languages.reduce((sum: number, lang: any) => sum + (lang.totalStars || 0), 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">Total Stars</div>
                </div>
                <div className="bg-linear-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl p-6">
                    <div className="text-3xl font-bold text-orange-400">
                        {data.languages[0]?.language || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">Most Popular</div>
                </div>
            </div>

            {/* Bubble Chart - Language Ecosystem */}
            <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span className="text-3xl">🫧</span>
                    Language Ecosystem Map
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                    Bubble size represents total bytes, position shows repository distribution
                </p>
                <LiquidGlassCard>
                    <LanguageBubbleChart languages={data.languages} />
                </LiquidGlassCard>
            </section>

            {/* Treemap - Code Distribution */}
            <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span className="text-3xl">📦</span>
                    Code Distribution Treemap
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                    Visual representation of codebase composition by language
                </p>
                <LiquidGlassCard>
                    <LanguageTreemap languages={data.languages} />
                </LiquidGlassCard>
            </section>

            {/* Overview Chart */}
            <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span className="text-3xl">📈</span>
                    Language Popularity Overview
                </h2>
                <LanguageOverview languages={data.languages} />
            </section>

            {/* Trend Analysis */}
            <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span className="text-3xl">📉</span>
                    Growth Trajectory Analysis
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                    Comparing repository count vs code volume trends
                </p>
                <LiquidGlassCard>
                    <LanguageTrendChart languages={data.languages} />
                    <br />
                </LiquidGlassCard>
            </section>

            {/* Radar Comparison */}
            <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span className="text-3xl">🎯</span>
                    Top Languages Comparison
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                    Multi-dimensional comparison of leading programming languages
                </p>
                <LiquidGlassCard>
                    <LanguageRadarComparison languages={data.languages} />
                    <br />
                </LiquidGlassCard>
    
            </section>

            {/* Rankings */}
            <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span className="text-3xl">🏆</span>
                    Language Rankings
                </h2>
                <LiquidGlassCard>
                    <LanguageTable languages={data.languages} />
                    <br />
                </LiquidGlassCard>
            </section>
        </section>
    );
}