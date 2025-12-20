import { getGitHubEvents } from "@/lib/github";

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
  const events = await getGitHubEvents(username);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        Recent Activity
      </h2>

      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="border rounded p-4"
          >
            <p className="font-medium">
              {formatEvent(event.type)}
            </p>
            <p className="text-sm text-gray-600">
              {event.repo.name}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(event.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
