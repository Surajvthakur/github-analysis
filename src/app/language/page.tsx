import LanguageOverview from "@/app/components/global/LanguageOverview";
import LanguageTable from "@/app/components/global/LanguageTable";

async function getLanguages() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/global?type=languages`,
    { next: { revalidate: 60 * 60 * 12 } } // 12 hours
  );

  if (!res.ok) {
    throw new Error("Failed to fetch language analytics");
  }

  return res.json();
}

export default async function LanguagesPage() {
  const data = await getLanguages();

  return (
    <section className="space-y-14">
      {/* Header */}
      <header className="text-center mt-6">
        <h1 className="text-4xl font-bold mb-4">
          🌍 Programming Language Analytics
        </h1>
        <p className="max-w-2xl mx-auto">
          Analyze programming language popularity and ecosystem 
          dominance across GitHub repositories.
        </p>
      </header>

      {/* Overview Chart */}
      <LanguageOverview languages={data.languages} />

      {/* Rankings */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          📊 Language Rankings
        </h2>
        <LanguageTable languages={data.languages} />
      </section>
    </section>
  );
}
