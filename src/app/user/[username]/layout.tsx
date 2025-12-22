import Link from "next/link";

export default async function UserLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise <{ username: string }>;
}) {
  const { username } = await params;

  return (
    <div>
      {/* 🔗 Tabs */}
      <nav className="border-b border-gray-700 mb-8">
        <ul className="flex gap-6 text-sm font-medium">
          <li>
            <Link
              href={`/user/${username}`}
              className="pb-2 inline-block text-gray-300 hover:text-gray-100 transition-colors border-b-2 border-transparent hover:border-blue-500"
            >
              Overview
            </Link>
          </li>
          <li>
            <Link
              href={`/user/${username}/repos`}
              className="pb-2 inline-block text-gray-300 hover:text-gray-100 transition-colors border-b-2 border-transparent hover:border-blue-500"
            >
              Repositories
            </Link>
          </li>
          <li>
            <Link
              href={`/user/${username}/activity`}
              className="pb-2 inline-block text-gray-300 hover:text-gray-100 transition-colors border-b-2 border-transparent hover:border-blue-500"
            >
              Activity
            </Link>
          </li>
        </ul>
      </nav>

      {/* 🧠 Page Content */}
      {children}
    </div>
  );
}
