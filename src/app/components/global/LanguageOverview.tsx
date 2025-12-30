import LanguageChart from "@/app/components/LanguageChart";
import { LiquidGlassCard } from "@/components/liquid-weather-glass";

interface LanguageStat {
  language: string;
  repoCount: number;
  totalStars: number;
}

export default function LanguageOverview({
  languages,
}: {
  languages: LanguageStat[];
}) {
  const chartData = languages.map((l) => ({
    name: l.language,
    value: l.repoCount,
  }));

  return (
    <div className="rounded-2xl bg-transparent">
      <h3 className="text-xl font-bold mb-4">
        Language Popularity
      </h3>
        <LiquidGlassCard className="p-6" draggable={true}>
                  <LanguageChart data={chartData} />
        </LiquidGlassCard>
      

      <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
        {languages.map((l) => (
          <div
            key={l.language}
            className="flex justify-between"
          >
            <span>{l.language}</span>
            <span>{l.repoCount.toLocaleString()} repos</span>
          </div>
        ))}
      </div>
    </div>
  );
}
