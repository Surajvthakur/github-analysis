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
