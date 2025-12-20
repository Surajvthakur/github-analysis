import { getGitHubUser } from "@/lib/github";
import CompareCard from "@/app/components/CompareCard";
import CompareStats from "@/app/components/CompareStats";
import CompareLanguageStats from "@/app/components/CompareLanguageStats";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ user1?: string; user2?: string }>;
}) {
  const { user1, user2 } = await searchParams;

  if (!user1 || !user2) {
    return (
      <p className="text-center mt-20 text-gray-600">
        Please provide two usernames to compare.
      </p>
    );
  }

  const [u1, u2] = await Promise.all([
    getGitHubUser(user1),
    getGitHubUser(user2),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-10 text-center">
        GitHub Profile Comparison
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <CompareCard user={u1} />
        <CompareCard user={u2} />
      </div>

      <CompareStats user1={u1} user2={u2} />
      <CompareLanguageStats user1={user1} user2={user2} />
    </div>
  );
}
