"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UserError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("User page error:", error);
  }, [error]);

  return (
    <div className="text-center mt-20">
      <h2 className="text-2xl font-bold mb-4 text-gray-100">
        Something went wrong
      </h2>

      <p className="text-gray-400 mb-2">
        {error.message || "An error occurred while loading the user profile."}
      </p>
      
      {error.digest && (
        <p className="text-xs text-gray-500 mb-6">
          Error ID: {error.digest}
        </p>
      )}

      <div className="flex justify-center gap-4">
        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition"
        >
          Go Home
        </button>

        <button
          onClick={() => reset()}
          className="border border-gray-600 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
