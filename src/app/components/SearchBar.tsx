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
        className="flex-1 border border-gray-600 rounded-lg px-4 py-3 bg-gray-900/50 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />
      <button
        onClick={handleSearch}
        disabled={!username.trim()}
        className="border border-gray-600 rounded-lg px-6 py-3 bg-gray-900/50 text-gray-100 font-semibold placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition hover:bg-gray-800/60 disabled:opacity-disabled:cursor-not-allowed"
      >
        Search
      </button>
    </div>
  );
}
