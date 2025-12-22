import { getGitHubRepos } from "@/lib/github";
import LanguageChart from "./LanguageChart";

function aggregateLanguages(repos: any[]) {
  const map: Record<string, number> = {};
  repos.forEach((r) => {
    if (!r.language) return;
    map[r.language] = (map[r.language] || 0) + 1;
  });

  return Object.entries(map).map(([name, value]) => ({
    name,
    value,
  }));
}

export default async function CompareLanguageStats({
  user1,
  user2,
}: {
  user1: string;
  user2: string;
}) {
  const [r1, r2] = await Promise.all([
    getGitHubRepos(user1),
    getGitHubRepos(user2),
  ]);

  const data1 = aggregateLanguages(r1);
  const data2 = aggregateLanguages(r2);

  return (
    <div className="mt-14">
      <h2 className="text-2xl font-bold mb-8 text-center text-gray-100">
        Language Usage Comparison
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="rounded-2xl bg-gray-800/90 backdrop-blur p-6 shadow-lg border border-gray-700 w-[500px]">
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-100">
            {user1}
          </h3>
          <LanguageChart data={data1} />
        </div>

        <div className="rounded-2xl bg-gray-800/90 backdrop-blur p-6 shadow-lg border border-gray-700 w-[500px]">
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-100">
            {user2}
          </h3>
          <LanguageChart data={data2} />
        </div>
      </div>
    </div>
  );
}
