import LanguageBarChart from "@/app/components/global/LanguageBarChart";
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
  return (
    <div className="rounded-2xl bg-transparent">
      <h3 className="text-xl font-bold mb-4">
        🔤 Language Popularity
      </h3>
      <LiquidGlassCard className="p-6" draggable={true}>
        <LanguageBarChart languages={languages} />
      </LiquidGlassCard>
    </div>
  );
}
