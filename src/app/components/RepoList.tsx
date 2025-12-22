import { getGitHubRepos } from "@/lib/github";

interface Repo {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  html_url: string;
}

export default async function RepoList({
  username,
}: {
  username: string;
}) {
  const repos: Repo[] = await getGitHubRepos(username);

  return (
    <div className="mt-10">
      <h3 className="text-2xl font-bold mb-4 text-gray-100">Repositories</h3>

      <div className="space-y-4">
        {repos.map((repo) => (
          <div
            key={repo.id}
            className="border border-gray-700 rounded-lg p-4 bg-gray-800/90 hover:bg-gray-800 transition-colors"
          >
            <a
              href={repo.html_url}
              target="_blank"
              className="text-lg font-semibold text-blue-400 hover:text-blue-300"
            >
              {repo.name}
            </a>

            {repo.description && (
              <p className="text-gray-300 mt-1">
                {repo.description}
              </p>
            )}

            <div className="flex gap-4 text-sm mt-2 text-gray-400">
              {repo.language && <span>{repo.language}</span>}
              <span>⭐ {repo.stargazers_count}</span>
              <span>🍴 {repo.forks_count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
