import Link from "next/link";

interface Repo {
    name: string;
    stars: number;
    forks: number;
    language: string;
    updated_at: string;
    url: string;
}

export default function TrendingTable({
    repos,
}: {
    repos: Repo[];
}) {
    return (
        <div className="overflow-x-auto border rounded-xl">
            <table className="min-w-full text-sm">
                <thead className="bg-muted/40">
                    <tr>
                        <th className="text-left px-4 py-3">#</th>
                        <th className="text-left px-4 py-3">Repository</th>
                        <th className="text-left px-4 py-3">Language</th>
                        <th className="text-right px-4 py-3">Stars</th>
                        <th className="text-right px-4 py-3">Forks</th>
                        <th className="text-right px-4 py-3">Updated</th>
                        <th className="text-right px-4 py-3"></th>
                    </tr>
                </thead>

                <tbody>
                    {repos.map((repo, index) => (
                        <tr
                            key={repo.name}
                            className="border-t hover:bg-muted/30 transition"
                        >
                            <td className="px-4 py-3 font-medium">
                                {index + 1}
                            </td>

                            <td className="px-4 py-3">
                                <div className="font-semibold">
                                    {repo.name}
                                </div>
                            </td>

                            <td className="px-4 py-3">
                                {repo.language ?? "—"}
                            </td>

                            <td className="px-4 py-3 text-right">
                                ⭐ {repo.stars.toLocaleString()}
                            </td>

                            <td className="px-4 py-3 text-right">
                                🍴 {repo.forks.toLocaleString()}
                            </td>

                            <td className="px-4 py-3 text-right text-gray-500">
                                {new Date(repo.updated_at).toLocaleDateString()}
                            </td>

                            <td className="px-4 py-3 text-right">
                                <Link
                                    href={repo.url}
                                    target="_blank"
                                    className="text-blue-600 hover:underline"
                                >
                                    View →
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
