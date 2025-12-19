"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UserError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="text-center mt-20">
      <h2 className="text-2xl font-bold mb-4">
        User not found
      </h2>

      <p className="text-gray-600 mb-6">
        The GitHub user you are looking for does not exist.
      </p>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => router.push("/")}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Go Home
        </button>

        <button
          onClick={() => reset()}
          className="border px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
