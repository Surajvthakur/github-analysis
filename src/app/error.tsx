"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="text-center p-8 rounded-2xl bg-gray-800/90 backdrop-blur shadow-lg border border-gray-700">
        <h2 className="text-3xl font-bold mb-4 text-gray-100">
          Something went wrong!
        </h2>
        <p className="text-gray-400 mb-6">
          {error.message || "An unexpected error occurred"}
        </p>
        {error.digest && (
          <p className="text-xs text-gray-500 mb-6">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => reset()}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg transition"
          >
            Try again
          </button>
          <Link
            href="/"
            className="border border-gray-600 hover:bg-gray-700 text-gray-300 px-6 py-3 rounded-lg transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
