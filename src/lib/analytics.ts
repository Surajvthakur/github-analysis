interface DeveloperMetrics {
  repos: number;
  stars: number;
  forks: number;
  followers: number;
  following: number;
  commits: number;
  languages: number;
  contributions: number;
}

export function calculateDeveloperScore(metrics: DeveloperMetrics): {
  score: number;
  breakdown: Record<string, number>;
  level: string;
} {
  const weights = {
    repos: 10,
    stars: 15,
    forks: 10,
    followers: 20,
    commits: 25,
    languages: 10,
    contributions: 10,
  };

  // Normalize metrics (using logarithmic scaling for large numbers)
  const normalize = (value: number, max: number = 1000) => {
    return Math.min(100, (Math.log10(value + 1) / Math.log10(max + 1)) * 100);
  };

  const breakdown = {
    repos: normalize(metrics.repos, 100) * (weights.repos / 100),
    stars: normalize(metrics.stars, 10000) * (weights.stars / 100),
    forks: normalize(metrics.forks, 1000) * (weights.forks / 100),
    followers: normalize(metrics.followers, 10000) * (weights.followers / 100),
    commits: normalize(metrics.commits, 5000) * (weights.commits / 100),
    languages: normalize(metrics.languages, 20) * (weights.languages / 100),
    contributions: normalize(metrics.contributions, 1000) * (weights.contributions / 100),
  };

  const score = Math.round(
    Object.values(breakdown).reduce((sum, val) => sum + val, 0)
  );

  const level = getLevel(score);

  return { score, breakdown, level };
}

function getLevel(score: number): string {
  if (score >= 90) return "Legendary";
  if (score >= 80) return "Expert";
  if (score >= 70) return "Advanced";
  if (score >= 60) return "Intermediate";
  if (score >= 50) return "Rising";
  if (score >= 40) return "Developing";
  if (score >= 30) return "Beginner";
  return "Getting Started";
}

export function getSkillAssessment(languages: Record<string, number>): {
  primary: string[];
  secondary: string[];
  emerging: string[];
} {
  const sorted = Object.entries(languages).sort((a, b) => b[1] - a[1]);
  const total = Object.values(languages).reduce((sum, val) => sum + val, 0);

  const primary = sorted
    .filter(([_, count]) => count / total >= 0.3)
    .map(([lang]) => lang);

  const secondary = sorted
    .filter(
      ([_, count]) => count / total >= 0.1 && count / total < 0.3
    )
    .map(([lang]) => lang);

  const emerging = sorted
    .filter(([_, count]) => count / total < 0.1)
    .slice(0, 5)
    .map(([lang]) => lang);

  return { primary, secondary, emerging };
}
