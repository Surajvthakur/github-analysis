import RadarComparison from "@/app/components/compare/RadarComparison";
import { getGitHubRepos, getGitHubEvents } from "@/lib/github";

function normalize(value: number, max: number) {
  if (max === 0) return 0;
  // Using a logarithmic scale or capping can help if one user is a "100x" outlier
  return Math.round((value / max) * 100);
}

export default async function RadarStats({
  user1,
  user2,
  u1,
  u2,
}: {
  user1: string;
  user2: string;
  u1: any;
  u2: any;
}) {
  const [repos1, repos2, events1, events2] = await Promise.all([
    getGitHubRepos(user1),
    getGitHubRepos(user2),
    getGitHubEvents(user1),
    getGitHubEvents(user2),
  ]);

  // Calculations for new metrics
  const totalStars1 = repos1.reduce((s, r) => s + r.stargazers_count, 0);
  const totalStars2 = repos2.reduce((s, r) => s + r.stargazers_count, 0);

  const avgStars1 = totalStars1 / Math.max(repos1.length, 1);
  const avgStars2 = totalStars2 / Math.max(repos2.length, 1);

  // Filter events for actual "work" (Push, PullRequest, Issues)
  const activity1 = events1.filter((e: any) => 
    ["PushEvent", "PullRequestEvent", "IssuesEvent"].includes(e.type)
  ).length;
  const activity2 = events2.filter((e: any) => 
    ["PushEvent", "PullRequestEvent", "IssuesEvent"].includes(e.type)
  ).length;

  const metrics = [
    {
      metric: "Influence", // Combined Followers/Following ratio feel
      u1: u1.followers,
      u2: u2.followers,
    },
    {
      metric: "Library Size",
      u1: u1.public_repos,
      u2: u2.public_repos,
    },
    {
      metric: "Avg Quality", // Stars per repo
      u1: avgStars1,
      u2: avgStars2,
    },
    {
      metric: "Total Impact", // Total stars
      u1: totalStars1,
      u2: totalStars2,
    },
    {
      metric: "Recent Velocity", // Code-related events
      u1: activity1,
      u2: activity2,
    },
    {
      metric: "Documentation", // Gists
      u1: u1.public_gists || 0,
      u2: u2.public_gists || 0,
    },
  ];

  // Normalize per metric
  const radarData = metrics.map((m) => {
    const max = Math.max(m.u1, m.u2);
    return {
      metric: m.metric,
      [user1]: normalize(m.u1, max),
      [user2]: normalize(m.u2, max),
    };
  });

  return (
    <div className="w-full py-10 flex flex-col items-center">
      <h3 className="text-xl font-bold mb-6 text-gray-200">Developer Archetype</h3>
      <RadarComparison data={radarData} users={[user1, user2]} />
    </div>
  );
}