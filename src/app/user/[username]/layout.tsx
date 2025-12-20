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
      <nav className="border-b mb-8">
        <ul className="flex gap-6 text-sm font-medium">
          <li>
            <Link
              href={`/user/${username}`}
              className="pb-2 inline-block hover:text-black"
            >
              Overview
            </Link>
          </li>
          <li>
            <Link
              href={`/user/${username}/repos`}
              className="pb-2 inline-block hover:text-black"
            >
              Repositories
            </Link>
          </li>
          <li>
            <Link
              href={`/user/${username}/activity`}
              className="pb-2 inline-block hover:text-black"
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
