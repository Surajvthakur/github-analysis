import { getCommitActivity } from "@/lib/github";
import ContributionHeatmap from "@/app/components/ContributionHeatmap";

export default async function ContributionStats({
  username,
}: {
  username: string;
}) {
  const data = await getCommitActivity(username);

  return (
    <div className="mt-14">
      <h3 className="text-2xl font-bold mb-4">
        Contribution Activity
      </h3>
      <ContributionHeatmap data={data} />
    </div>
  );
}
