interface Repo {
    name: string;
    stars: number;
    forks: number;
    openIssues: number;
    watchers: number;
    language: string;
    url: string;
    description: string;
}

export default function RepoCompareCard({
    repo,
}: {
    repo: Repo;
}) {
    return (
        <div className="border rounded-2xl p-6 bg-muted/30">
            <h2 className="text-xl font-bold mb-2">
                {repo.name}
            </h2>

            {repo.description && (
                <p className="text-sm text-gray-600 mb-4">
                    {repo.description}
                </p>
            )}

            <div className="space-y-2 text-sm">
                <div>⭐ Stars: {repo.stars.toLocaleString()}</div>
                <div>🍴 Forks: {repo.forks.toLocaleString()}</div>
                <div>🐛 Open Issues: {repo.openIssues.toLocaleString()}</div>
                <div>👀 Watchers: {repo.watchers.toLocaleString()}</div>
                <div>🧠 Language: {repo.language ?? "Unknown"}</div>
            </div>

            <a
                href={repo.url}
                target="_blank"
                className="inline-block mt-4 text-blue-600 hover:underline"
            >
                View on GitHub →
            </a>
        </div>
    );
}
