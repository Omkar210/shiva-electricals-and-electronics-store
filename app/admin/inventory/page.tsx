import Link from "next/link";
import { requireStaffOrAdmin } from "@/lib/auth/roles";
import { getCategories, type CategoryItem } from "@/lib/catalog/categories";
import {
  getInventoryMetrics,
  listInventoryItems,
} from "@/lib/inventory/service";
import { InventoryFilters } from "./InventoryFilters";
import { InventoryTable } from "./InventoryTable";
import {
  Boxes,
  AlertTriangle,
  XCircle,
  IndianRupee,
  History,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventory & Stock Central — Admin Portal",
};

interface AdminInventoryPageProps {
  searchParams: Promise<{
    status?: string;
    category?: string;
    search?: string;
  }>;
}

export default async function AdminInventoryPage({
  searchParams,
}: AdminInventoryPageProps) {
  await requireStaffOrAdmin("/admin/inventory");
  const resolvedParams = await searchParams;

  const [metrics, categories, items] = await Promise.all([
    getInventoryMetrics(),
    getCategories({ onlyActive: false }),
    listInventoryItems({
      status: resolvedParams.status,
      categoryId: resolvedParams.category,
      search: resolvedParams.search,
    }),
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Inventory Central
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Monitor real-time warehouse stock, track low-stock thresholds, and log verified adjustments.
          </p>
        </div>

        <Link
          href="/admin/inventory/audit"
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 hover:text-blue-600 transition shrink-0"
        >
          <History className="h-4 w-4" />
          View Complete Audit Log &rarr;
        </Link>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {/* Total Stock Units */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold">Total Stock Units</span>
            <div className="rounded-lg bg-blue-50 p-1.5 text-blue-600">
              <Boxes className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-gray-900">
            {metrics.totalUnits.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] text-gray-400">
            Across {metrics.totalProducts} catalog products
          </span>
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-xs font-semibold">Low Stock Warnings</span>
            <div className="rounded-lg bg-amber-100 p-1.5 text-amber-700">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-amber-900">
            {metrics.lowStockCount}
          </p>
          <span className="text-[11px] text-amber-700 font-medium">
            At or below alert threshold
          </span>
        </div>

        {/* Out of Stock */}
        <div className="rounded-xl border border-red-200 bg-red-50/50 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-red-700">
            <span className="text-xs font-semibold">Out of Stock</span>
            <div className="rounded-lg bg-red-100 p-1.5 text-red-700">
              <XCircle className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-red-900">
            {metrics.outOfStockCount}
          </p>
          <span className="text-[11px] text-red-700 font-medium">
            0 units available for sale
          </span>
        </div>

        {/* Total Stock Asset Valuation */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-semibold">Inventory Valuation</span>
            <div className="rounded-lg bg-emerald-100 p-1.5 text-emerald-700">
              <IndianRupee className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-900">
            ₹{metrics.totalValuation.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] text-emerald-700">
            Calculated at current selling price
          </span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <InventoryFilters
        categories={categories.map((c: CategoryItem) => ({ id: c.id, name: c.name }))}
        lowStockCount={metrics.lowStockCount}
        outOfStockCount={metrics.outOfStockCount}
      />

      {/* Main Stock Table */}
      <InventoryTable items={items} />
    </div>
  );
}
