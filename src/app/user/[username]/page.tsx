import Image from "next/image";
import type { Metadata } from "next";
import { getGitHubUser, getGitHubRepos } from "@/lib/github";
import RepoList from "@/app/components/RepoList";
import { Suspense } from "react";
import LanguageStats from "@/app/components/LanguageStats";

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

  const user = await getGitHubUser(username);

  return (
    <div>
      <section className="flex gap-6 items-start mb-10">
        {/* Avatar */}
        <Image
          src={user.avatar_url}
          alt={user.login}
          width={120}
          height={120}
          className="rounded-full"
        />

        {/* Profile Info */}
        <div>
          <h2 className="text-3xl font-bold">
            {user.name ?? user.login}
          </h2>
          <p className="text-gray-500 mb-2">@{user.login}</p>

          {user.bio && (
            <p className="text-gray-700 mb-4">{user.bio}</p>
          )}

          <div className="flex gap-6 text-sm">
            <span>
              <strong>{user.followers}</strong> followers
            </span>
            <span>
              <strong>{user.following}</strong> following
            </span>
            <span>
              <strong>{user.public_repos}</strong> repos
            </span>
          </div>
        </div>
      </section>
      <LanguageStats username={username} />

      <Suspense fallback={<RepoSkeleton />}>
  <RepoList username={username} />
      </Suspense>

      
    </div>
  );
}