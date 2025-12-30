"use client";

import { eachDayOfInterval, subDays, format, getDay } from "date-fns";

export default function ContributionHeatmap({
  data,
}: {
  data: Record<string, number>;
}) {
  const startDate = subDays(new Date(), 90);
  const endDate = new Date();

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  // Pad start so the first column starts on Sunday
  const paddingDays = getDay(startDate);
  const paddedDays = [
    ...Array(paddingDays).fill(null),
    ...days,
  ];

  return (
    <div className="w-full overflow-x-auto">
  <div className="grid grid-rows-7 grid-flow-col gap-1 w-max">
    {paddedDays.map((day, idx) => {
      if (!day) {
        return <div key={idx} className="w-4 h-4" />;
      }

      const key = format(day, "yyyy-MM-dd");
      const count = data[key] || 0;

      const intensity =
        count === 0
          ? "bg-slate-800"
          : count < 3
          ? "bg-green-900"
          : count < 6
          ? "bg-green-600"
          : "bg-green-400";

      return (
        <div
          key={key}
          title={`${key}: ${count} commits`}
          className={`w-4 h-4 rounded ${intensity}`}
        />
      );
    })}
  </div>
</div>

  );
}
