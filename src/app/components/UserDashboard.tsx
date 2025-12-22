import { getGitHubUser, getGitHubRepos, getGitHubEvents } from "@/lib/github";
import AnimatedStats from "./AnimatedStats";
import RepoStatsChart from "./RepoStatsChart";
import LanguageTrendChart from "./LanguageTrendChart";
import EnhancedHeatmap from "./EnhancedHeatmap";
import { getCommitActivity } from "@/lib/github";
import RepoNetwork from "./RepoNetwork";
import SkillRadarChart from "./RadarChart";
import StarHistory from "./StarHistory";

interface UserDashboardProps {
  username: string;
}

export default async function UserDashboard({ username }: UserDashboardProps) {
  const [user, repos, events, commitActivity] = await Promise.all([
    getGitHubUser(username),
    getGitHubRepos(username),
    getGitHubEvents(username).catch(() => []),
    getCommitActivity(username).catch(() => ({})),
  ]);

  // Calculate total stars and forks
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
  const totalCommits = Object.values(commitActivity).reduce(
    (sum, count) => sum + (count as number),
    0
  );

  const stats = [
    {
      label: "Repositories",
      value: user.public_repos,
      icon: "📦",
      color: "#3b82f6",
    },
    {
      label: "Total Stars",
      value: totalStars,
      icon: "⭐",
      color: "#f59e0b",
    },
    {
      label: "Total Forks",
      value: totalForks,
      icon: "🍴",
      color: "#10b981",
    },
    {
      label: "Followers",
      value: user.followers,
      icon: "👥",
      color: "#8b5cf6",
    },
    {
      label: "Following",
      value: user.following,
      icon: "🔗",
      color: "#ec4899",
    },
    {
      label: "Recent Commits",
      value: totalCommits,
      icon: "💻",
      color: "#06b6d4",
    },
  ];

  // Prepare radar chart data
  const languageData: Record<string, { count: number; stars: number; forks: number }> = {};
  repos.forEach((repo) => {
    if (!repo.language) return;
    if (!languageData[repo.language]) {
      languageData[repo.language] = { count: 0, stars: 0, forks: 0 };
    }
    languageData[repo.language].count++;
    languageData[repo.language].stars += repo.stargazers_count;
    languageData[repo.language].forks += repo.forks_count;
  });

  const radarData = Object.entries(languageData)
    .map(([language, data]) => ({
      language,
      count: data.count,
      stars: data.stars,
      forks: data.forks,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return (
    <div className="space-y-8">
      {/* Animated Stats */}
      <AnimatedStats stats={stats} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Repository Statistics */}
        <div className="rounded-2xl bg-gray-800/90 backdrop-blur shadow-lg p-6 border border-gray-700">
          <RepoStatsChart repos={repos} />
        </div>

        {/* Star History */}
        <div className="rounded-2xl bg-gray-800/90 backdrop-blur shadow-lg p-6 border border-gray-700">
          <StarHistory repos={repos} />
        </div>

        {/* Language Trend */}
        <div className="rounded-2xl bg-gray-800/90 backdrop-blur shadow-lg p-6 border border-gray-700">
          <LanguageTrendChart repos={repos} />
        </div>

        {/* Enhanced Heatmap */}
        <div className="rounded-2xl bg-gray-800/90 backdrop-blur shadow-lg p-6 border border-gray-700">
          <EnhancedHeatmap data={commitActivity} />
        </div>

        {/* Repository Network */}
        <div className="rounded-2xl bg-gray-800/90 backdrop-blur shadow-lg p-6 border border-gray-700">
          <RepoNetwork repos={repos} />
        </div>

        {/* Radar Chart */}
        {radarData.length > 0 && (
          <div className="rounded-2xl bg-gray-800/90 backdrop-blur shadow-lg p-6 border border-gray-700">
            <SkillRadarChart data={radarData} />
          </div>
        )}
      </div>
    </div>
  );
}
