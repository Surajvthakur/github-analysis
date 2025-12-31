import { getCommitActivity } from "@/lib/github";
import ContributionHeatmap from "@/app/components/ContributionHeatmap";
import { LiquidGlassCard } from "@/components/liquid-weather-glass";

export default async function CompareHeatmaps({
    user1,
    user2,
}: {
    user1: string;
    user2: string;
}) {
    // Server aggregates once - no duplicate logic
    const [activity1, activity2] = await Promise.all([
        getCommitActivity(user1),
        getCommitActivity(user2),
    ]);

    // Calculate total contributions for each user
    const total1 = Object.values(activity1).reduce((sum, val) => sum + val, 0);
    const total2 = Object.values(activity2).reduce((sum, val) => sum + val, 0);

    return (
        <div className="mt-10">
            <h2 className="text-2xl font-bold mb-8 text-center text-gray-100">
                📊 Contribution Heatmap Comparison
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User 1 Heatmap */}
                <LiquidGlassCard className="p-6" draggable={true}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-100">{user1}</h3>
                        <span className="text-sm text-green-400 font-medium">
                            {total1} contributions
                        </span>
                    </div>
                    <ContributionHeatmap data={activity1} />
                </LiquidGlassCard>

                {/* User 2 Heatmap */}
                <LiquidGlassCard className="p-6" draggable={true}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-100">{user2}</h3>
                        <span className="text-sm text-green-400 font-medium">
                            {total2} contributions
                        </span>
                    </div>
                    <ContributionHeatmap data={activity2} />
                </LiquidGlassCard>
            </div>
        </div>
    );
}
