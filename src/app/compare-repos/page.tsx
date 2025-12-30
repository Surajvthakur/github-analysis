import RepoCompareCard from "@/app/components/global/RepoCompareCard";
import RepoCompareStats from "@/app/components/global/RepoCompareStats";
import { LiquidGlassCard } from "@/components/liquid-weather-glass";

async function getRepo(name: string) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/global?type=repo&name=${name}`,
        { next: { revalidate: 60 * 60 } }
    );

    if (!res.ok) {
        throw new Error(`Failed to fetch repo: ${name}`);
    }

    const data = await res.json();
    return data.repo;
}

export default async function CompareReposPage({
    searchParams,
}: {
    searchParams: Promise<{ repo1?: string; repo2?: string }>;
}) {
    const { repo1, repo2 } = await searchParams;

    // Missing params
    if (!repo1 || !repo2) {
        return (
            <div className="text-center mt-20 text-gray-600">
                Please provide two repositories to compare.
                <br />
                <code className="block mt-2">
                    /compare-repos?repo1=facebook/react&repo2=vuejs/vue
                </code>
            </div>
        );
    }

    const [leftRepo, rightRepo] = await Promise.all([
        getRepo(repo1),
        getRepo(repo2),
    ]);

    return (
        <section className="space-y-12">
            <header className="text-center mt-6">
                <h1 className="text-4xl font-bold mb-4">
                    Repository Comparison
                </h1>
                <p>
                    Comparing <strong>{repo1}</strong> vs{" "}
                    <strong>{repo2}</strong>
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <LiquidGlassCard>
                    <RepoCompareCard repo={leftRepo} />
                </LiquidGlassCard>
                <LiquidGlassCard>
                    <RepoCompareCard repo={rightRepo} />
                </LiquidGlassCard>
            </div>

            <RepoCompareStats left={leftRepo} right={rightRepo} />
        </section>
    );
}
