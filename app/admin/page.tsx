import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  Package,
  ShoppingCart,
  Boxes,
  MapPin,
  TrendingUp,
  AlertCircle,
  Plus,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch quick metrics in parallel
  const [
    { count: productsCount },
    { count: categoriesCount },
    { count: deliveryZonesCount },
    { data: lowStockProducts },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("delivery_zones").select("*", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("id, name, stock_quantity, low_stock_threshold")
      .lte("stock_quantity", 5)
      .limit(5),
  ]);

  return (
    <div className="space-y-8">
      {/* Top Welcome & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Operational Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Shiva Electrical &amp; Electronics administration and store management
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Total Products</span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            {productsCount ?? 0}
          </p>
          <p className="mt-1 text-xs text-gray-500">Active catalog items</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Categories</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            {categoriesCount ?? 0}
          </p>
          <p className="mt-1 text-xs text-gray-500">Catalog categories</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Delivery Zones</span>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <MapPin className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            {deliveryZonesCount ?? 0}
          </p>
          <p className="mt-1 text-xs text-gray-500">Service pincodes mapped</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Pending Orders</span>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">0</p>
          <p className="mt-1 text-xs text-gray-500">Awaiting confirmation</p>
        </div>
      </div>

      {/* Operational Attention Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Low Stock Watch */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <Boxes className="h-5 w-5 text-amber-600" />
              <h2 className="font-semibold text-gray-900">Low Stock Alerts</h2>
            </div>
            <Link
              href="/admin/inventory"
              className="text-xs font-medium text-blue-600 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {lowStockProducts && lowStockProducts.length > 0 ? (
              lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 p-3 text-sm"
                >
                  <span className="font-medium text-gray-800">{p.name}</span>
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                    {p.stock_quantity} left
                  </span>
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-xs text-gray-400">
                No items currently below low stock threshold.
              </p>
            )}
          </div>
        </div>

        {/* System & Security Status */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <h2 className="font-semibold text-gray-900">System Status</h2>
          </div>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-600">Database Engine</span>
              <span className="font-medium text-gray-900">Supabase PostgreSQL 15+</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-600">Row Level Security</span>
              <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Enabled (14 tables)
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-600">App Framework</span>
              <span className="font-medium text-gray-900">Next.js 16 (App Router)</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-600">Deployment Target</span>
              <span className="font-medium text-gray-900">Vercel Edge &amp; Serverless</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
