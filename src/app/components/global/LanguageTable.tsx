interface LanguageStat {
  language: string;
  repoCount: number;
  totalStars: number;
}

export default function LanguageTable({
  languages,
}: {
  languages: LanguageStat[];
}) {
  const sorted = [...languages].sort(
    (a, b) => b.repoCount - a.repoCount
  );

  return (
    <div className="overflow-x-auto border rounded-xl">
      <table className="min-w-full text-sm">
        <thead className="bg-muted/40">
          <tr>
            <th className="text-left px-4 py-3">#</th>
            <th className="text-left px-4 py-3">Language</th>
            <th className="text-right px-4 py-3">
              Repositories
            </th>
            <th className="text-right px-4 py-3">
              Total Stars
            </th>
          </tr>
        </thead>

        <tbody>
          {sorted.map((lang, index) => (
            <tr
              key={lang.language}
              className="border-t hover:bg-muted/30 transition"
            >
              <td className="px-4 py-3 font-medium">
                {index + 1}
              </td>

              <td className="px-4 py-3 font-semibold">
                {lang.language}
              </td>

              <td className="px-4 py-3 text-right">
                {lang.repoCount.toLocaleString()}
              </td>

              <td className="px-4 py-3 text-right">
                ⭐ {lang.totalStars.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
