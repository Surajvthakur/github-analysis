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
import GlassCard from "./GlassCard";
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
      <GlassCard>
        <div className="p-6">
          <DeveloperScore
            score={developerScore.score}
            breakdown={developerScore.breakdown}
            level={developerScore.level}
          />
        </div>
      </GlassCard>

      {/* Streak Tracker */}
      <GlassCard>
        <div className="p-6">
          <StreakTracker
            currentStreak={streakData.currentStreak}
            longestStreak={streakData.longestStreak}
            totalDays={streakData.totalDays}
          />
        </div>
      </GlassCard>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Repository Statistics */}
        <GlassCard>
          <div className="p-6">
            <RepoStatsChart repos={repos} />
          </div>
        </GlassCard>

        {/* Star History */}
        <GlassCard>
          <div className="p-6">
            <StarHistory repos={repos} />
          </div>
        </GlassCard>

        {/* Language Trend */}
        <GlassCard>
          <div className="p-6">
            <LanguageTrendChart repos={repos} />
          </div>
        </GlassCard>

        {/* Enhanced Heatmap */}
        <GlassCard>
          <div className="p-6">
            <EnhancedHeatmap data={commitActivity} />
          </div>
        </GlassCard>

        {/* Repository Network */}
        <GlassCard>
          <div className="p-6">
            <RepoNetwork repos={repos} />
          </div>
        </GlassCard>

        {/* Radar Chart */}
        {radarData.length > 0 && (
          <GlassCard>
            <div className="p-6">
              <SkillRadarChart data={radarData} />
            </div>
          </GlassCard>
        )}

        {/* Hourly Activity */}
        <GlassCard>
          <div className="p-6">
            <HourlyActivityChart data={hourlyActivity} />
          </div>
        </GlassCard>
      </div>

      {/* Growth Trends */}
      {growthData.length > 0 && (
        <GlassCard>
          <div className="p-6">
            <GrowthTrends data={growthData} />
          </div>
        </GlassCard>
      )}

      {/* Achievements */}
      <GlassCard>
        <div className="p-6">
          <AchievementBadges achievements={achievements} />
        </div>
      </GlassCard>

      {/* Collaboration Network */}
      {collaborators.length > 0 && (
        <GlassCard>
          <div className="p-6">
            <CollaborationNetwork contributors={collaborators} />
          </div>
        </GlassCard>
      )}

      {/* Live Activity Feed */}
      <GlassCard>
        <div className="p-6">
          <LiveActivityFeed username={username} />
        </div>
      </GlassCard>
    </div>
  );
  } catch (error) {
    console.error("Error in UserDashboard:", error);
    throw error;
  }
}
