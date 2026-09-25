"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import type { CategoryItem } from "@/lib/catalog/categories";
import { Search, ArrowUpDown, Loader2 } from "lucide-react";

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
    <div className="space-y-5 rounded-xl border-2 border-slate-200 bg-white p-5 shadow-xs sm:p-6">
      {/* Search Input and Sort Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search products by name, model, or brand..."
            className="h-12 w-full rounded-lg border-2 border-slate-300 bg-white py-2 pl-12 pr-28 text-base text-slate-900 placeholder:text-slate-500 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
            aria-label="Search catalog"
          />
          <button
            type="submit"
            disabled={isPending}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 items-center justify-center rounded-md bg-blue-700 px-4 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-50 transition-colors"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-4">
          {/* Large In-Stock Checkbox */}
          <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border-2 border-slate-200 bg-slate-50 px-3.5 py-2 hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) =>
                updateFilters("inStock", e.target.checked ? "true" : null)
              }
              className="h-5 w-5 rounded border-slate-400 text-blue-700 focus:ring-blue-700 cursor-pointer"
            />
            <span className="text-sm font-bold text-slate-800">In Stock Only</span>
          </label>

          {/* Sort Dropdown */}
          <div className="relative flex items-center">
            <ArrowUpDown className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-500" />
            <select
              value={currentSort}
              onChange={(e) => updateFilters("sort", e.target.value)}
              className="h-11 rounded-lg border-2 border-slate-300 bg-white pl-10 pr-8 text-sm font-bold text-slate-800 focus:border-blue-700 focus:outline-none cursor-pointer"
              aria-label="Sort products"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills with Senior-Friendly 40px Height & Bold Labels */}
      <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1">
        <button
          type="button"
          onClick={() => updateFilters("category", null)}
          className={`shrink-0 flex h-10 items-center justify-center rounded-lg px-4 text-sm font-bold transition-colors cursor-pointer ${
            !currentCategory
              ? "bg-blue-700 text-white shadow-xs"
              : "border-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:border-slate-400"
          }`}
        >
          All Items
        </button>

        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => updateFilters("category", c.slug)}
            className={`shrink-0 flex h-10 items-center justify-center rounded-lg px-4 text-sm font-bold transition-colors cursor-pointer ${
              currentCategory === c.slug
                ? "bg-blue-700 text-white shadow-xs"
                : "border-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:border-slate-400"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
