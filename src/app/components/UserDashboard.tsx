import { getGitHubUser, getGitHubRepos, getGitHubEvents, getCommitActivity, getHourlyActivity, getStreakData, getGrowthMetrics, getCollaborators } from "@/lib/github";
import AnimatedStats from "./AnimatedStats";
import RepoStatsChart from "./RepoStatsChart";
import LanguageTrendChart from "./LanguageTrendChart";
import EnhancedHeatmap from "./EnhancedHeatmap";
import RepoNetwork from "./RepoNetwork";
import SkillRadarChart from "./RadarChart";
import StarHistory from "./StarHistory";
import HourlyActivityChart from "./HourlyActivityChart";
import StreakTracker from "./StreakTracker";
import DeveloperScore from "./DeveloperScore";
import ExportButton from "./ExportButton";
import GrowthTrends from "./GrowthTrends";
import AchievementBadges from "./AchievementBadges";
import CollaborationNetwork from "./CollaborationNetwork";
import LiveActivityFeed from "./LiveActivityFeed";
import { calculateDeveloperScore } from "@/lib/analytics";
import { calculateAchievements } from "@/lib/gamification";

interface UserDashboardProps {
  username: string;
}

export default async function UserDashboard({ username }: UserDashboardProps) {
  try {
    const [user, repos, events, commitActivity, hourlyActivity, streakData, growthData, collaborators] = await Promise.all([
      getGitHubUser(username).catch((error) => {
        console.error("Failed to fetch user:", error);
        throw error;
      }),
      getGitHubRepos(username).catch((error) => {
        console.error("Failed to fetch repos:", error);
        throw error;
      }),
      getGitHubEvents(username).catch(() => []),
      getCommitActivity(username).catch(() => ({})),
      getHourlyActivity(username).catch(() => ({})),
      getStreakData(username).catch(() => ({ currentStreak: 0, longestStreak: 0, totalDays: 0 })),
      getGrowthMetrics(username).catch(() => []),
      getCollaborators(username).catch(() => []),
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

  // Calculate developer score
  const developerScore = calculateDeveloperScore({
    repos: user.public_repos,
    stars: totalStars,
    forks: totalForks,
    followers: user.followers,
    following: user.following,
    commits: totalCommits,
    languages: Object.keys(languageData).length,
    contributions: totalCommits,
  });

  // Calculate achievements
  const achievements = calculateAchievements({
    repos: user.public_repos,
    stars: totalStars,
    forks: totalForks,
    followers: user.followers,
    commits: totalCommits,
    contributions: totalCommits,
  });

  return (
    <div id="dashboard" className="space-y-8">
      {/* Export Button */}
      <div className="flex justify-end">
        <ExportButton
          elementId="dashboard"
          filename={`${username}-analytics`}
          title={`${username} - GitHub Analytics`}
        />
      </div>

      {/* Animated Stats */}
      <AnimatedStats stats={stats} />

      {/* Developer Score */}
      <div className="rounded-2xl bg-gray-800/90 backdrop-blur shadow-lg p-6 border border-gray-700">
        <DeveloperScore
          score={developerScore.score}
          breakdown={developerScore.breakdown}
          level={developerScore.level}
        />
      </div>

      {/* Streak Tracker */}
      <div className="rounded-2xl bg-gray-800/90 backdrop-blur shadow-lg p-6 border border-gray-700">
        <StreakTracker
          currentStreak={streakData.currentStreak}
          longestStreak={streakData.longestStreak}
          totalDays={streakData.totalDays}
        />
      </div>

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

        {/* Hourly Activity */}
        <div className="rounded-2xl bg-gray-800/90 backdrop-blur shadow-lg p-6 border border-gray-700">
          <HourlyActivityChart data={hourlyActivity} />
        </div>
      </div>

      {/* Growth Trends */}
      {growthData.length > 0 && (
        <div className="rounded-2xl bg-gray-800/90 backdrop-blur shadow-lg p-6 border border-gray-700">
          <GrowthTrends data={growthData} />
        </div>
      )}

      {/* Achievements */}
      <div className="rounded-2xl bg-gray-800/90 backdrop-blur shadow-lg p-6 border border-gray-700">
        <AchievementBadges achievements={achievements} />
      </div>

      {/* Collaboration Network */}
      {collaborators.length > 0 && (
        <div className="rounded-2xl bg-gray-800/90 backdrop-blur shadow-lg p-6 border border-gray-700">
          <CollaborationNetwork contributors={collaborators} />
        </div>
      )}

      {/* Live Activity Feed */}
      <div className="rounded-2xl bg-gray-800/90 backdrop-blur shadow-lg p-6 border border-gray-700">
        <LiveActivityFeed username={username} />
      </div>
    </div>
  );
  } catch (error) {
    console.error("Error in UserDashboard:", error);
    throw error;
  }
}
