import { getGitHubRepos } from "@/lib/github";
import RepoListClient from "./RepoListClient";

export default async function RepoList({
  username,
}: {
  username: string;
}) {
  const repos = await getGitHubRepos(username);

  return (
    <div className="mt-10">
      <h3 className="text-2xl font-bold mb-4 text-gray-100">Repositories</h3>
      <RepoListClient repos={repos} username={username} />
    </div>
  );
}
