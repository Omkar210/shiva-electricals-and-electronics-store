"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import type { CategoryItem } from "@/lib/catalog/categories";
import { Search, ArrowUpDown } from "lucide-react";

interface SearchFilterBarProps {
  categories: CategoryItem[];
}

export default function SearchFilterBar({ categories }: SearchFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentCategory = searchParams.get("category") || "";
  const currentQuery = searchParams.get("q") || "";
  const currentSort = searchParams.get("sort") || "newest";
  const inStockOnly = searchParams.get("inStock") === "true";

  const [searchVal, setSearchVal] = useState(currentQuery);

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.push(`/products?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters("q", searchVal.trim() || null);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs sm:p-5">
      {/* Search Input and Sort Selection */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search products by model, brand, or SKU..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-20 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          />
          <button
            type="submit"
            disabled={isPending}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? "..." : "Search"}
          </button>
        </form>

        <div className="flex items-center gap-3">
          {/* In Stock Toggle */}
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-gray-700">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) =>
                updateFilters("inStock", e.target.checked ? "true" : null)
              }
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>In Stock Only</span>
          </label>

          {/* Sort Dropdown */}
          <div className="relative flex items-center">
            <ArrowUpDown className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-gray-400" />
            <select
              value={currentSort}
              onChange={(e) => updateFilters("sort", e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-8 pr-8 text-xs font-medium text-gray-700 focus:border-blue-600 focus:bg-white focus:outline-none"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1">
        <button
          type="button"
          onClick={() => updateFilters("category", null)}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            !currentCategory
              ? "bg-blue-600 text-white shadow-xs"
              : "border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
          }`}
        >
          All Products
        </button>

        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => updateFilters("category", c.slug)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              currentCategory === c.slug
                ? "bg-blue-600 text-white shadow-xs"
                : "border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
