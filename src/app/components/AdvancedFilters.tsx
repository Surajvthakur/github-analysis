"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface AdvancedFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  languages: string[];
  minStars: number;
  maxStars: number;
  minForks: number;
  maxForks: number;
  dateRange: {
    start: string;
    end: string;
  };
  sortBy: "stars" | "forks" | "updated" | "name";
  sortOrder: "asc" | "desc";
}

export default function AdvancedFilters({
  onFilterChange,
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    languages: [],
    minStars: 0,
    maxStars: 10000,
    minForks: 0,
    maxForks: 1000,
    dateRange: {
      start: "",
      end: "",
    },
    sortBy: "stars",
    sortOrder: "desc",
  });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-lg transition"
      >
        <span>🔍</span>
        <span>Advanced Filters</span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 p-6 rounded-lg bg-gray-800/90 border border-gray-700"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Stars Range */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Stars Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minStars || ""}
                  onChange={(e) =>
                    handleFilterChange({
                      minStars: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded text-gray-100 text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxStars || ""}
                  onChange={(e) =>
                    handleFilterChange({
                      maxStars: parseInt(e.target.value) || 10000,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded text-gray-100 text-sm"
                />
              </div>
            </div>

            {/* Forks Range */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Forks Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minForks || ""}
                  onChange={(e) =>
                    handleFilterChange({
                      minForks: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded text-gray-100 text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxForks || ""}
                  onChange={(e) =>
                    handleFilterChange({
                      maxForks: parseInt(e.target.value) || 1000,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded text-gray-100 text-sm"
                />
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  handleFilterChange({
                    sortBy: e.target.value as FilterState["sortBy"],
                  })
                }
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded text-gray-100 text-sm"
              >
                <option value="stars">Stars</option>
                <option value="forks">Forks</option>
                <option value="updated">Updated</option>
                <option value="name">Name</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Order
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) =>
                  handleFilterChange({
                    sortOrder: e.target.value as FilterState["sortOrder"],
                  })
                }
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded text-gray-100 text-sm"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) =>
                  handleFilterChange({
                    dateRange: { ...filters.dateRange, start: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded text-gray-100 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) =>
                  handleFilterChange({
                    dateRange: { ...filters.dateRange, end: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded text-gray-100 text-sm"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                const reset: FilterState = {
                  languages: [],
                  minStars: 0,
                  maxStars: 10000,
                  minForks: 0,
                  maxForks: 1000,
                  dateRange: { start: "", end: "" },
                  sortBy: "stars",
                  sortOrder: "desc",
                };
                setFilters(reset);
                onFilterChange(reset);
              }}
              className="px-4 py-2 text-gray-400 hover:text-gray-200 transition"
            >
              Reset Filters
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
