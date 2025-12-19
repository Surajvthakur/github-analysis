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