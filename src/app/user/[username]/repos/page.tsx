import { Suspense } from "react";
import RepoList from "@/app/components/RepoList";

function RepoSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="border rounded p-4 animate-pulse"
        >
          <div className="h-5 w-40 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-64 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}

export default async function ReposPage({
  params,
}: {
  params: Promise <{ username: string }>;
}) {
  const { username } = await params;
  return (
    <Suspense fallback={<RepoSkeleton />}>
      <RepoList username={username} />
    </Suspense>
  );
}
