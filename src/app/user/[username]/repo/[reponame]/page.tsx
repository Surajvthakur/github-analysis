import { getRepoDetails, getPRStats, getIssues, getReleases, getContributors } from "@/lib/github";
import RepoDetailStats from "@/app/components/RepoDetailStats";
import PRAnalytics from "@/app/components/PRAnalytics";
import IssueTracker from "@/app/components/IssueTracker";
import Link from "next/link";

interface RepoPageProps {
  params: Promise<{
    username: string;
    reponame: string;
  }>;
}

export default async function RepoPage({ params }: RepoPageProps) {
  const { username, reponame } = await params;

  const [repo, prStats, issues, releases, contributors] = await Promise.all([
    getRepoDetails(username, reponame).catch(() => null),
    getPRStats(username, reponame).catch(() => ({
      open: 0,
      closed: 0,
      merged: 0,
      avgMergeTime: 0,
    })),
    getIssues(username, reponame).catch(() => ({
      open: 0,
      closed: 0,
      labels: {},
    })),
    getReleases(username, reponame).catch(() => []),
    getContributors(username, reponame).catch(() => []),
  ]);

  if (!repo) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-300 text-lg mb-4">Repository not found</p>
        <Link
          href={`/user/${username}`}
          className="text-blue-400 hover:text-blue-300"
        >
          Back to profile
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href={`/user/${username}`}
            className="text-blue-400 hover:text-blue-300 text-sm mb-2 inline-block"
          >
            ← Back to {username}
          </Link>
          <h1 className="text-4xl font-bold text-gray-100 mb-2">{repo.name}</h1>
          {repo.description && (
            <p className="text-gray-300">{repo.description}</p>
          )}
        </div>
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition"
        >
          View on GitHub
        </a>
      </div>

      {/* Repository Stats */}
      <div className="rounded-2xl bg-gray-800/90 backdrop-blur shadow-lg p-6 border border-gray-700">
        <RepoDetailStats repo={repo} contributors={contributors} />
      </div>

      {/* PR Analytics */}
      <div className="rounded-2xl bg-gray-800/90 backdrop-blur shadow-lg p-6 border border-gray-700">
        <PRAnalytics
          open={prStats.open}
          closed={prStats.closed}
          merged={prStats.merged}
          avgMergeTime={prStats.avgMergeTime}
        />
      </div>

      {/* Issue Tracker */}
      <div className="rounded-2xl bg-gray-800/90 backdrop-blur shadow-lg p-6 border border-gray-700">
        <IssueTracker
          open={issues.open}
          closed={issues.closed}
          labels={issues.labels}
        />
      </div>

      {/* Releases */}
      {releases.length > 0 && (
        <div className="rounded-2xl bg-gray-800/90 backdrop-blur shadow-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-gray-100">Recent Releases</h3>
          <div className="space-y-4">
            {releases.slice(0, 10).map((release: any) => (
              <div
                key={release.id}
                className="p-4 rounded-lg bg-gray-900/50 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-semibold text-gray-100">
                    {release.tag_name}
                  </h4>
                  <span className="text-sm text-gray-400">
                    {new Date(release.published_at).toLocaleDateString()}
                  </span>
                </div>
                {release.body && (
                  <p className="text-gray-300 text-sm line-clamp-3">
                    {release.body}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
