"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, X } from "lucide-react";

interface CategoryOption {
  id: string;
  name: string;
}

interface InventoryFiltersProps {
  categories: CategoryOption[];
  lowStockCount: number;
  outOfStockCount: number;
}

export function InventoryFilters({
  categories,
  lowStockCount,
  outOfStockCount,
}: InventoryFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentStatus = searchParams.get("status") || "ALL";
  const currentCategory = searchParams.get("category") || "ALL";
  const initialSearch = searchParams.get("search") || "";
  const [searchValue, setSearchValue] = useState(initialSearch);

  const updateFilters = (newStatus: string, newCategory: string, newSearch: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newStatus && newStatus !== "ALL") {
      params.set("status", newStatus);
    } else {
      params.delete("status");
    }

    if (newCategory && newCategory !== "ALL") {
      params.set("category", newCategory);
    } else {
      params.delete("category");
    }

    if (newSearch.trim()) {
      params.set("search", newSearch.trim());
    } else {
      params.delete("search");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(currentStatus, currentCategory, searchValue);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    updateFilters(currentStatus, currentCategory, "");
  };

  return (
    <div className="space-y-4">
      {/* Search and Category Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by Product Name or SKU..."
              className="w-full rounded-xl border border-gray-300 pl-9 pr-9 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
            />
            {searchValue && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="rounded-xl bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-gray-800 cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Category Select */}
        <div className="w-full sm:w-56">
          <select
            value={currentCategory}
            onChange={(e) => updateFilters(currentStatus, e.target.value, searchValue)}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <button
          type="button"
          onClick={() => updateFilters("ALL", currentCategory, searchValue)}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer transition ${
            currentStatus === "ALL"
              ? "bg-blue-600 text-white shadow-2xs"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All Stock
        </button>

        <button
          type="button"
          onClick={() => updateFilters("LOW_STOCK", currentCategory, searchValue)}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer transition ${
            currentStatus === "LOW_STOCK"
              ? "bg-amber-600 text-white shadow-2xs"
              : "bg-amber-50 text-amber-800 hover:bg-amber-100"
          }`}
        >
          <span>Low Stock Alert</span>
          <span className="rounded-full bg-amber-200/80 px-1.5 py-0.2 text-[10px] font-bold text-amber-900">
            {lowStockCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => updateFilters("OUT_OF_STOCK", currentCategory, searchValue)}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer transition ${
            currentStatus === "OUT_OF_STOCK"
              ? "bg-red-600 text-white shadow-2xs"
              : "bg-red-50 text-red-800 hover:bg-red-100"
          }`}
        >
          <span>Out of Stock</span>
          <span className="rounded-full bg-red-200/80 px-1.5 py-0.2 text-[10px] font-bold text-red-900">
            {outOfStockCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => updateFilters("HEALTHY", currentCategory, searchValue)}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer transition ${
            currentStatus === "HEALTHY"
              ? "bg-emerald-600 text-white shadow-2xs"
              : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
          }`}
        >
          Healthy Stock
        </button>
      </div>
    </div>
  );
}
