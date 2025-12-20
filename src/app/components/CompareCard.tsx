import Image from "next/image";

export default function CompareCard({ user }: { user: any }) {
  return (
    <div className="border rounded-2xl p-6 text-center">
      <Image
        src={user.avatar_url}
        alt={user.login}
        width={100}
        height={100}
        className="rounded-full mx-auto"
      />

      <h2 className="text-xl font-bold mt-4">
        {user.name ?? user.login}
      </h2>
      <p className="text-gray-500">@{user.login}</p>

      {user.bio && (
        <p className="text-sm mt-3">{user.bio}</p>
      )}
    </div>
  );
}
