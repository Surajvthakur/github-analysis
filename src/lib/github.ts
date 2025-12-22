interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  followers: number;
  following: number;
  public_repos: number;
}

export async function getGitHubUser(
  username: string
): Promise<GitHubUser> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not configured");
  }

  const res = await fetch(
    `${baseUrl}/api/github?username=${username}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch user: ${res.status}`);
  }

  return res.json();
}
interface GitHubEvent {
  id: string;
  type: string;
  repo: {
    name: string;
  };
  created_at: string;
}

export async function getGitHubEvents(
  username: string
): Promise<GitHubEvent[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/github?username=${username}&type=events`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch activity");
  }

  return res.json();
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  html_url: string;
  updated_at: string;
  created_at: string;
}

export async function getGitHubRepos(
  username: string
): Promise<GitHubRepo[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not configured");
  }

  const res = await fetch(
    `${baseUrl}/api/github?username=${username}&type=repos`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch repositories: ${res.status}`);
  }

  return res.json();
}

export async function getCommitActivity(username: string) {
  const repos = await getGitHubRepos(username);
  const activity: Record<string, number> = {};

  await Promise.all(
    repos.slice(0, 10).map(async (repo) => {
      const res = await fetch(
        `https://api.github.com/repos/${username}/${repo.name}/commits?per_page=30`,
        {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          },
        }
      );

      if (!res.ok) return;

      const commits = await res.json();
      commits.forEach((c: any) => {
        const date = c.commit.author.date.slice(0, 10);
        activity[date] = (activity[date] || 0) + 1;
      });
    })
  );

  return activity;
}

export async function getHourlyActivity(username: string) {
  const repos = await getGitHubRepos(username);
  const hourlyActivity: Record<number, number> = {};

  await Promise.all(
    repos.slice(0, 10).map(async (repo) => {
      const res = await fetch(
        `https://api.github.com/repos/${username}/${repo.name}/commits?per_page=100`,
        {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          },
        }
      );

      if (!res.ok) return;

      const commits = await res.json();
      commits.forEach((c: any) => {
        const date = new Date(c.commit.author.date);
        const hour = date.getHours();
        hourlyActivity[hour] = (hourlyActivity[hour] || 0) + 1;
      });
    })
  );

  return hourlyActivity;
}

export async function getStreakData(username: string) {
  const activity = await getCommitActivity(username);
  const dates = Object.keys(activity).sort();
  
  if (dates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, totalDays: 0 };
  }

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate current streak
  let checkDate = new Date(today);
  while (dates.includes(formatDate(checkDate))) {
    currentStreak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Calculate longest streak
  for (let i = 0; i < dates.length; i++) {
    if (i === 0 || isConsecutive(dates[i - 1], dates[i])) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  return {
    currentStreak,
    longestStreak,
    totalDays: dates.length,
  };
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function isConsecutive(date1: string, date2: string): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setDate(d1.getDate() + 1);
  return formatDate(d1) === date2;
}

export async function getRepoDetails(username: string, repoName: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not configured");
  }

  const res = await fetch(
    `https://api.github.com/repos/${username}/${repoName}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch repository");
  }

  return res.json();
}

export async function getPRStats(username: string, repoName: string) {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/pulls?state=all&per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      }
    );

    if (!res.ok) return { open: 0, closed: 0, merged: 0, avgMergeTime: 0 };

    const prs = await res.json();
    const open = prs.filter((pr: any) => pr.state === "open").length;
    const closed = prs.filter((pr: any) => pr.state === "closed" && !pr.merged_at).length;
    const merged = prs.filter((pr: any) => pr.merged_at).length;

    const mergedPRs = prs.filter((pr: any) => pr.merged_at);
    const mergeTimes = mergedPRs.map((pr: any) => {
      const created = new Date(pr.created_at);
      const merged = new Date(pr.merged_at);
      return (merged.getTime() - created.getTime()) / (1000 * 60 * 60 * 24); // days
    });

    const avgMergeTime =
      mergeTimes.length > 0
        ? mergeTimes.reduce((sum: number, time: number) => sum + time, 0) /
          mergeTimes.length
        : 0;

    return { open, closed, merged, avgMergeTime: Math.round(avgMergeTime * 10) / 10 };
  } catch {
    return { open: 0, closed: 0, merged: 0, avgMergeTime: 0 };
  }
}

export async function getIssues(username: string, repoName: string) {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/issues?state=all&per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      }
    );

    if (!res.ok) return { open: 0, closed: 0, labels: {} };

    const issues = await res.json();
    const open = issues.filter((issue: any) => issue.state === "open").length;
    const closed = issues.filter((issue: any) => issue.state === "closed").length;

    const labels: Record<string, number> = {};
    issues.forEach((issue: any) => {
      issue.labels.forEach((label: any) => {
        labels[label.name] = (labels[label.name] || 0) + 1;
      });
    });

    return { open, closed, labels };
  } catch {
    return { open: 0, closed: 0, labels: {} };
  }
}

export async function getReleases(username: string, repoName: string) {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/releases?per_page=20`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      }
    );

    if (!res.ok) return [];

    return res.json();
  } catch {
    return [];
  }
}

export async function getContributors(username: string, repoName: string) {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/contributors?per_page=30`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      }
    );

    if (!res.ok) return [];

    return res.json();
  } catch {
    return [];
  }
}

export async function getCollaborators(username: string) {
  const repos = await getGitHubRepos(username);
  const collaborators: Record<string, number> = {};

  await Promise.all(
    repos.slice(0, 20).map(async (repo) => {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${username}/${repo.name}/contributors?per_page=10`,
          {
            headers: {
              Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            },
          }
        );

        if (!res.ok) return;

        const contributors = await res.json();
        contributors.forEach((contributor: any) => {
          if (contributor.login !== username) {
            collaborators[contributor.login] =
              (collaborators[contributor.login] || 0) + contributor.contributions;
          }
        });
      } catch {
        // Ignore errors
      }
    })
  );

  return Object.entries(collaborators)
    .map(([login, contributions]) => ({
      login,
      contributions,
    }))
    .sort((a, b) => b.contributions - a.contributions)
    .slice(0, 30);
}

export async function getGrowthMetrics(username: string) {
  // Simulated growth data - in production, you'd fetch historical data
  // For now, we'll use current data and simulate growth
  const user = await getGitHubUser(username);
  const repos = await getGitHubRepos(username);
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

  // Generate monthly data for the last 12 months
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    return {
      date: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      followers: Math.round(user.followers * (0.3 + (i / 12) * 0.7)),
      stars: Math.round(totalStars * (0.2 + (i / 12) * 0.8)),
      repos: Math.round(user.public_repos * (0.4 + (i / 12) * 0.6)),
    };
  });

  return months;
}
