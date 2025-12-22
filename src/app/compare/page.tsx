import { getGitHubUser, getGitHubRepos } from "@/lib/github";
import CompareCard from "@/app/components/CompareCard";
import CompareStats from "@/app/components/CompareStats";
import CompareLanguageStats from "@/app/components/CompareLanguageStats";
import ComparisonChart from "@/app/components/ComparisonChart";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ user1?: string; user2?: string }>;
}) {
  const { user1, user2 } = await searchParams;

  if (!user1 || !user2) {
    return (
      <div className="text-center mt-20">
        <p className="text-gray-300 text-lg">
          Please provide two usernames to compare.
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Use the format: /compare?user1=username1&user2=username2
        </p>
      </div>
    );
  }

  const [u1, u2, repos1, repos2] = await Promise.all([
    getGitHubUser(user1),
    getGitHubUser(user2),
    getGitHubRepos(user1).catch(() => []),
    getGitHubRepos(user2).catch(() => []),
  ]);

  const totalStars1 = repos1.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalStars2 = repos2.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks1 = repos1.reduce((sum, repo) => sum + repo.forks_count, 0);
  const totalForks2 = repos2.reduce((sum, repo) => sum + repo.forks_count, 0);

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold mb-10 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        GitHub Profile Comparison
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <CompareCard user={u1} />
        <CompareCard user={u2} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-gray-800/90 backdrop-blur shadow-lg p-6 border border-gray-700">
          <ComparisonChart
            user1={user1}
            user2={user2}
            data1={totalStars1}
            data2={totalStars2}
            label="Total Stars"
          />
        </div>
        <div className="rounded-2xl bg-gray-800/90 backdrop-blur shadow-lg p-6 border border-gray-700">
          <ComparisonChart
            user1={user1}
            user2={user2}
            data1={totalForks1}
            data2={totalForks2}
            label="Total Forks"
          />
        </div>
      </div>

      <div className="rounded-2xl bg-gray-800/90 backdrop-blur shadow-lg p-6 border border-gray-700">
        <CompareStats user1={u1} user2={u2} />
      </div>

      <CompareLanguageStats user1={user1} user2={user2} />
    </div>
  );
}
