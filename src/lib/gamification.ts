interface UserMetrics {
  repos: number;
  stars: number;
  forks: number;
  followers: number;
  commits: number;
  contributions: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

export function calculateAchievements(metrics: UserMetrics): Achievement[] {
  const achievements: Achievement[] = [];

  // Repository Achievements
  achievements.push({
    id: "repo-10",
    name: "Repository Starter",
    description: "Create 10 repositories",
    icon: "📦",
    unlocked: metrics.repos >= 10,
    progress: metrics.repos,
    maxProgress: 10,
  });

  achievements.push({
    id: "repo-50",
    name: "Repository Master",
    description: "Create 50 repositories",
    icon: "📚",
    unlocked: metrics.repos >= 50,
    progress: metrics.repos,
    maxProgress: 50,
  });

  achievements.push({
    id: "repo-100",
    name: "Repository Legend",
    description: "Create 100 repositories",
    icon: "🏆",
    unlocked: metrics.repos >= 100,
    progress: metrics.repos,
    maxProgress: 100,
  });

  // Star Achievements
  achievements.push({
    id: "star-100",
    name: "Star Collector",
    description: "Receive 100 stars",
    icon: "⭐",
    unlocked: metrics.stars >= 100,
    progress: metrics.stars,
    maxProgress: 100,
  });

  achievements.push({
    id: "star-1000",
    name: "Star Magnet",
    description: "Receive 1,000 stars",
    icon: "🌟",
    unlocked: metrics.stars >= 1000,
    progress: metrics.stars,
    maxProgress: 1000,
  });

  achievements.push({
    id: "star-10000",
    name: "Star Superstar",
    description: "Receive 10,000 stars",
    icon: "✨",
    unlocked: metrics.stars >= 10000,
    progress: metrics.stars,
    maxProgress: 10000,
  });

  // Follower Achievements
  achievements.push({
    id: "follower-100",
    name: "Rising Star",
    description: "Reach 100 followers",
    icon: "👥",
    unlocked: metrics.followers >= 100,
    progress: metrics.followers,
    maxProgress: 100,
  });

  achievements.push({
    id: "follower-1000",
    name: "Influencer",
    description: "Reach 1,000 followers",
    icon: "🌟",
    unlocked: metrics.followers >= 1000,
    progress: metrics.followers,
    maxProgress: 1000,
  });

  achievements.push({
    id: "follower-10000",
    name: "GitHub Celebrity",
    description: "Reach 10,000 followers",
    icon: "🎖️",
    unlocked: metrics.followers >= 10000,
    progress: metrics.followers,
    maxProgress: 10000,
  });

  // Commit Achievements
  achievements.push({
    id: "commit-100",
    name: "Committed Developer",
    description: "Make 100 commits",
    icon: "💻",
    unlocked: metrics.commits >= 100,
    progress: metrics.commits,
    maxProgress: 100,
  });

  achievements.push({
    id: "commit-1000",
    name: "Code Machine",
    description: "Make 1,000 commits",
    icon: "⚡",
    unlocked: metrics.commits >= 1000,
    progress: metrics.commits,
    maxProgress: 1000,
  });

  achievements.push({
    id: "commit-10000",
    name: "Commit Master",
    description: "Make 10,000 commits",
    icon: "🔥",
    unlocked: metrics.commits >= 10000,
    progress: metrics.commits,
    maxProgress: 10000,
  });

  // Fork Achievements
  achievements.push({
    id: "fork-50",
    name: "Fork Enthusiast",
    description: "Get 50 forks",
    icon: "🍴",
    unlocked: metrics.forks >= 50,
    progress: metrics.forks,
    maxProgress: 50,
  });

  achievements.push({
    id: "fork-500",
    name: "Fork Champion",
    description: "Get 500 forks",
    icon: "🥄",
    unlocked: metrics.forks >= 500,
    progress: metrics.forks,
    maxProgress: 500,
  });

  return achievements;
}

export function getUnlockedCount(achievements: Achievement[]): number {
  return achievements.filter((a) => a.unlocked).length;
}

export function getTotalProgress(achievements: Achievement[]): number {
  const total = achievements.length;
  const unlocked = getUnlockedCount(achievements);
  return total > 0 ? Math.round((unlocked / total) * 100) : 0;
}
