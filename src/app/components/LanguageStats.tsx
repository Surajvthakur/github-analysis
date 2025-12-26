import { getGitHubRepos } from "@/lib/github";
import LanguageChart from "./LanguageChart";
import { LiquidGlassCard } from "@/components/liquid-weather-glass";

interface Repo {
  language: string | null;
}

export default async function LanguageStats({
  username,
}: {
  username: string;
}) {
  const repos: Repo[] = await getGitHubRepos(username);

  const languageCount: Record<string, number> = {};

  repos.forEach((repo) => {
    if (!repo.language) return;
    languageCount[repo.language] =
      (languageCount[repo.language] || 0) + 1;
  });

  const chartData = Object.entries(languageCount).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  if (chartData.length === 0) {
    return null;
  }

  return (
    <div className="mt-14">
      <h3 className="text-2xl font-bold mb-6 text-gray-100">
        Language Usage
      </h3>
  
      <LiquidGlassCard className="p-6" draggable={false}>
        <LanguageChart data={chartData} />
      </LiquidGlassCard>
    </div>
  );
  
}
