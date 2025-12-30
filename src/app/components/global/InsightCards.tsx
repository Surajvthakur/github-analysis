interface Insight {
  title: string;
  value: string;
  description: string;
}

export default function InsightCards({
  insights,
}: {
  insights: Insight[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {insights.map((insight) => (
        <div
          key={insight.title}
          className="border rounded-xl p-5 bg-muted/40"
        >
          <h4 className="font-semibold mb-1">
            {insight.title}
          </h4>
          <p className="text-lg font-bold mb-2">
            {insight.value}
          </p>
          <p className="text-sm text-gray-600">
            {insight.description}
          </p>
        </div>
      ))}
    </div>
  );
}
