import Link from "next/link";

interface Repo {
  name: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
}

export default function TrendingList({
  repos,
}: {
  repos: Repo[];
}) {
  return (
    <div className="space-y-4">
      {repos.map((repo, index) => (
        <div
          key={repo.name}
          className="flex items-center justify-between border rounded-xl p-4 hover:bg-muted transition"
        >
          <div>
            <p className="font-semibold">
              #{index + 1} {repo.name}
            </p>
            <p className="text-sm text-gray-500">
              {repo.language ?? "Unknown"}
            </p>
          </div>

          <div className="flex gap-4 text-sm">
            <span>⭐ {repo.stars.toLocaleString()}</span>
            <span>🍴 {repo.forks.toLocaleString()}</span>
            <Link
              href={repo.url}
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              View →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
