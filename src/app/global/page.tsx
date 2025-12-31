import TrendingList from "@/app/components/global/TrendingList";
import LanguageOverview from "@/app/components/global/LanguageOverview";
import InsightCards from "@/app/components/global/InsightCards";

async function getGlobalData() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/global?type=dashboard`,
        { next: { revalidate: 60 * 60 * 6 } }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch global dashboard");
    }

    return res.json();
}

export default async function GlobalDashboardPage() {
    const data = await getGlobalData();

    return (
        <section className="space-y-16">
            {/* Header */}
            <header className="text-center mt-6">
                <h1 className="text-4xl font-bold mb-4">
                    Global GitHub Analytics
                </h1>
                <p className="max-w-2xl mx-auto">
                    Explore trends, popular repositories, and language
                    insights across the GitHub ecosystem.
                </p>
            </header>

            {/* Trending */}
            <section>
                <h2 className="text-2xl font-bold mb-4">
                    🔥 Trending Repositories
                </h2>
                <TrendingList repos={data.trending} />
            </section>

            {/* Languages */}
            <section>
                <LanguageOverview languages={data.languages} />
            </section>

            {/* Insights */}
            <section>
                <h2 className="text-2xl font-bold mb-4">
                    📊 Ecosystem Insights
                </h2>
                <InsightCards insights={data.insights} />
            </section>
        </section>
    );
}
