import Image from "next/image";
import type { Metadata } from "next";
import { getGitHubUser, getGitHubRepos } from "@/lib/github";
import RepoList from "@/app/components/RepoList";
import { Suspense } from "react";
import LanguageStats from "@/app/components/LanguageStats";
import UserDashboard from "@/app/components/UserDashboard";
import { LiquidGlassCard } from "@/components/liquid-weather-glass";

interface UserPageProps {
  params: Promise<{
    username: string;
  }>;
}

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  followers: number;
  following: number;
  public_repos: number;
}
function RepoSkeleton() {
  return (
    <div className="mt-10 space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="border rounded p-4 animate-pulse"
        >
          <div className="h-5 w-40 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-64 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}
export async function generateMetadata(
  { params }: { params: Promise<{ username: string }> }
): Promise<Metadata> {
  try {
    const { username } = await params;
    const user = await getGitHubUser(username);

    return {
      title: `${user.name ?? user.login} | GitHub Analytics`,
      description: user.bio ?? `GitHub profile analytics for ${user.login}`,
      openGraph: {
        title: `${user.name ?? user.login} | GitHub Analytics`,
        description:
          user.bio ?? `GitHub profile analytics for ${user.login}`,
        images: [
          {
            url: user.avatar_url,
            width: 400,
            height: 400,
            alt: user.login,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${user.name ?? user.login} | GitHub Analytics`,
        description:
          user.bio ?? `GitHub profile analytics for ${user.login}`,
        images: [user.avatar_url],
      },
    };
  } catch {
    return {
      title: "GitHub User Not Found",
    };
  }
}



export default async function UserPage({ params }: UserPageProps) {
  const { username } = await params;

  let user: GitHubUser;
  try {
    user = await getGitHubUser(username);
  } catch (error) {
    // Re-throw to let error boundary handle it
    throw error;
  }

  return (
    <div>
      <LiquidGlassCard className="flex gap-6 items-start mb-10 p-6" draggable={false}>
        {/* Avatar */}
        <div className="relative">
          <div className="absolute inset-0 "></div>
          <Image
            src={user.avatar_url}
            alt={user.login}
            width={120}
            height={120}
            className="rounded-full relative z-10 border-4 border-white dark:border-gray-800 shadow-xl"
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {user.name ?? user.login}
          </h2>
          <p className="text-gray-400 mb-3 text-lg">@{user.login}</p>

          {user.bio && (
            <p className="text-gray-300 mb-6 max-w-2xl">{user.bio}</p>
          )}

          <div className="flex gap-8 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👥</span>
              <div>
                <div className="font-bold text-lg text-gray-100">{user.followers.toLocaleString()}</div>
                <div className="text-gray-400 text-xs">followers</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔗</span>
              <div>
                <div className="font-bold text-lg text-gray-100">{user.following.toLocaleString()}</div>
                <div className="text-gray-400 text-xs">following</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📦</span>
              <div>
                <div className="font-bold text-lg text-gray-100">{user.public_repos.toLocaleString()}</div>
                <div className="text-gray-400 text-xs">repositories</div>
              </div>
            </div>
          </div>
        </div>
      </LiquidGlassCard>

      {/* Comprehensive Dashboard */}
      <Suspense fallback={<div className="animate-pulse">Loading dashboard...</div>}>
        <UserDashboard username={username} />
      </Suspense>

      <LanguageStats username={username} />

      <Suspense fallback={<RepoSkeleton />}>
        <RepoList username={username} />
      </Suspense>
    </div>
  );
}