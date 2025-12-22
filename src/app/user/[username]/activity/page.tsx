import { getGitHubEvents } from "@/lib/github";
import ContributionStats from "@/app/components/ContributionStats";
import ActivityTimeline from "@/app/components/ActivityTimeline";
import EventTypeChart from "@/app/components/EventTypeChart";
import EnhancedHeatmap from "@/app/components/EnhancedHeatmap";
import { getCommitActivity } from "@/lib/github";

function formatEvent(type: string) {
  switch (type) {
    case "PushEvent":
      return "Pushed commits";
    case "PullRequestEvent":
      return "Opened a pull request";
    case "IssuesEvent":
      return "Worked on an issue";
    default:
      return type.replace("Event", "");
  }
}

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const [events, commitActivity] = await Promise.all([
    getGitHubEvents(username).catch(() => []),
    getCommitActivity(username).catch(() => ({})),
  ]);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-100">Activity Analytics</h2>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Timeline */}
        <div className="rounded-2xl bg-gray-800/90 backdrop-blur shadow-lg p-6 border border-gray-700">
          <ActivityTimeline events={events} />
        </div>

        {/* Event Type Chart */}
        <div className="rounded-2xl bg-gray-800/90 backdrop-blur shadow-lg p-6 border border-gray-700">
          <EventTypeChart events={events} />
        </div>
      </div>

      {/* Enhanced Heatmap */}
      <div className="rounded-2xl bg-gray-800/90 backdrop-blur shadow-lg p-6 border border-gray-700">
        <EnhancedHeatmap data={commitActivity} />
      </div>

      {/* Recent Activity List */}
      <div className="rounded-2xl bg-gray-800/90 backdrop-blur shadow-lg p-6 border border-gray-700">
        <h3 className="text-2xl font-bold mb-6 text-gray-100">Recent Activity</h3>
        <div className="space-y-4">
          {events.slice(0, 20).map((event) => (
            <div
              key={event.id}
              className="border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition-colors"
            >
              <p className="font-medium text-gray-100">
                {formatEvent(event.type)}
              </p>
              <p className="text-sm text-gray-300">
                {event.repo.name}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(event.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
