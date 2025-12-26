"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdvancedFilters, { FilterState } from "./AdvancedFilters";
import { LiquidGlassCard } from "@/components/liquid-weather-glass";

interface Repo {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  html_url: string;
  updated_at?: string;
  created_at?: string;
}

interface RepoListClientProps {
  repos: Repo[];
  username: string;
}

export default function RepoListClient({
  repos,
  username,
}: RepoListClientProps) {
  const [filters, setFilters] = useState<FilterState>({
    languages: [],
    minStars: 0,
    maxStars: 10000,
    minForks: 0,
    maxForks: 1000,
    dateRange: { start: "", end: "" },
    sortBy: "stars",
    sortOrder: "desc",
  });

  const [searchQuery, setSearchQuery] = useState("");

  const filteredRepos = useMemo(() => {
    let filtered = [...repos];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (repo) =>
          repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Stars filter
    filtered = filtered.filter(
      (repo) =>
        repo.stargazers_count >= filters.minStars &&
        repo.stargazers_count <= filters.maxStars
    );

    // Forks filter
    filtered = filtered.filter(
      (repo) =>
        repo.forks_count >= filters.minForks &&
        repo.forks_count <= filters.maxForks
    );

    // Language filter
    if (filters.languages.length > 0) {
      filtered = filtered.filter((repo) =>
        filters.languages.includes(repo.language || "")
      );
    }

    // Date range filter
    if (filters.dateRange.start) {
      filtered = filtered.filter(
        (repo) => repo.created_at && new Date(repo.created_at) >= new Date(filters.dateRange.start)
      );
    }
    if (filters.dateRange.end) {
      filtered = filtered.filter(
        (repo) => repo.created_at && new Date(repo.created_at) <= new Date(filters.dateRange.end)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case "stars":
          comparison = a.stargazers_count - b.stargazers_count;
          break;
        case "forks":
          comparison = a.forks_count - b.forks_count;
          break;
        case "updated":
          comparison =
            (a.updated_at ? new Date(a.updated_at).getTime() : 0) -
            (b.updated_at ? new Date(b.updated_at).getTime() : 0);
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
      }
      return filters.sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [repos, filters, searchQuery]);

  // Get unique languages for filter
  const availableLanguages = useMemo(() => {
    const languages = new Set(
      repos.map((repo) => repo.language).filter(Boolean)
    );
    return Array.from(languages).sort();
  }, [repos]);

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search repositories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Advanced Filters */}
      <AdvancedFilters onFilterChange={setFilters} />

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-400">
        Showing {filteredRepos.length} of {repos.length} repositories
      </div>

      {/* Repository List */}
      <div className="space-y-4">
        {filteredRepos.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No repositories found matching your filters
          </div>
        ) : (
          filteredRepos.map((repo) => (
            <LiquidGlassCard
              key={repo.id}
              className="p-4"
              draggable={false}
              borderRadius="8px"
            >
              <div className="flex items-center gap-2">
                <a
                  href={repo.html_url}
                  target="_blank"
                  className="text-lg font-semibold text-blue-400 hover:text-blue-300"
                >
                  {repo.name}
                </a>
                <Link
                  href={`/user/${username}/repo/${repo.name}`}
                  className="text-xs text-gray-500 hover:text-gray-400 px-2 py-1 rounded bg-gray-700/50 hover:bg-gray-700 transition"
                >
                  Analytics →
                </Link>
              </div>

              {repo.description && (
                <p className="text-gray-300 mt-1">{repo.description}</p>
              )}

              <div className="flex gap-4 text-sm mt-2 text-gray-400">
                {repo.language && <span>{repo.language}</span>}
                <span>⭐ {repo.stargazers_count}</span>
                <span>🍴 {repo.forks_count}</span>
                {repo.updated_at && (
                  <span className="text-xs">
                    Updated {new Date(repo.updated_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>
            </LiquidGlassCard>
          ))
        )}
      </div>
    </div>
  );
}
