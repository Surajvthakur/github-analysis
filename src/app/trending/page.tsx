import TrendingTable from "@/app/components/global/TrendingTable";
import { LiquidGlassCard } from "@/components/liquid-weather-glass";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

async function getServerUrl(): Promise<string> {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "https";
  return `${protocol}://${host}`;
}

async function getTrending() {
  const baseUrl = await getServerUrl();
  const res = await fetch(
    `${baseUrl}/api/global?type=trending`,
    { cache: "no-store" }
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
