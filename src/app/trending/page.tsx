import TrendingTable from "@/app/components/global/TrendingTable";
import { LiquidGlassCard } from "@/components/liquid-weather-glass";
export const dynamic = "force-dynamic";

async function getTrending() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/global?type=trending`,
    { next: { revalidate: 60 * 60 * 6 } }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch trending repositories");
  }

  return res.json();
}

export default async function TrendingPage() {
  const data = await getTrending();

  return (
    <section className="space-y-10">
      {/* Header */}
      <header className="text-center mt-6">
        <h1 className="text-4xl font-bold mb-4">
          🔥 Trending Repositories
        </h1>
        <p className="max-w-2xl mx-auto">
          Discover the most popular and actively maintained
          repositories across GitHub.
        </p>
      </header>

      {/* Table */}
      <LiquidGlassCard>

      <TrendingTable repos={data.repos} />
      </LiquidGlassCard>
    </section>
  );
}
