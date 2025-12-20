"use client";

import { eachDayOfInterval, subDays, format } from "date-fns";

export default function ContributionHeatmap({
  data,
}: {
  data: Record<string, number>;
}) {
  const days = eachDayOfInterval({
    start: subDays(new Date(), 90),
    end: new Date(),
  });

  return (
    <div className="grid grid-cols-14 gap-1">
      {days.map((day) => {
        const key = format(day, "yyyy-MM-dd");
        const count = data[key] || 0;

        const intensity =
          count === 0
            ? "bg-gray-200"
            : count < 3
            ? "bg-green-300"
            : count < 6
            ? "bg-green-500"
            : "bg-green-700";

        return (
          <div
            key={key}
            title={`${key}: ${count} commits`}
            className={`w-4 h-4 rounded ${intensity}`}
          />
        );
      })}
    </div>
  );
}
