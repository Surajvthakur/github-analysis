"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (!username.trim()) return;

    router.push(`/user/${username.trim()}`);
  };

  return (
    <div className="flex gap-2 max-w-md mx-auto">
      <input
        type="text"
        placeholder="Enter GitHub username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
      />
      <button
        onClick={handleSearch}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Search
      </button>
    </div>
  );
}
