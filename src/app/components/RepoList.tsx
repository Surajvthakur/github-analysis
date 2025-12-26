import { getGitHubRepos } from "@/lib/github";
import RepoListClient from "./RepoListClient";
import GlassCard from "./GlassCard";

export default async function RepoList({
  username,
}: {
  username: string;
}) {
  const repos = await getGitHubRepos(username);

  return (
    <div className="mt-10">
      <h3 className="text-2xl font-bold mb-4 text-gray-100">Repositories</h3>
      <GlassCard>
        <div className="p-6">
          <RepoListClient repos={repos} username={username} />
        </div>
      </GlassCard>
    </div>
  );
}
