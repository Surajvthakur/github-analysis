function StatRow({
    label,
    v1,
    v2,
  }: {
    label: string;
    v1: number;
    v2: number;
  }) {
    const winner =
      v1 > v2 ? "left" : v2 > v1 ? "right" : "tie";
  
    return (
      <div className="grid grid-cols-3 py-3 border-b">
        <span
          className={`text-center ${
            winner === "left" && "font-bold text-green-600"
          }`}
        >
          {v1}
        </span>
        <span className="text-center font-medium">
          {label}
        </span>
        <span
          className={`text-center ${
            winner === "right" && "font-bold text-green-600"
          }`}
        >
          {v2}
        </span>
      </div>
    );
  }
  
  export default function CompareStats({
    user1,
    user2,
  }: {
    user1: any;
    user2: any;
  }) {
    return (
      <div className="mt-10 border rounded-xl">
        <StatRow
          label="Followers"
          v1={user1.followers}
          v2={user2.followers}
        />
        <StatRow
          label="Public Repos"
          v1={user1.public_repos}
          v2={user2.public_repos}
        />
        <StatRow
          label="Following"
          v1={user1.following}
          v2={user2.following}
        />
      </div>
    );
  }
  