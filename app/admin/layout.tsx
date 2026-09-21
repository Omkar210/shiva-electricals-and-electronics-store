import Link from "next/link";
import { requireRole } from "@/lib/auth/roles";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Boxes,
  MapPin,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireRole(["admin", "staff"], "/admin");

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600 text-white shadow-xs">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-gray-900">
                Admin Portal
              </span>
              <span className="ml-2 rounded-sm bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-700">
                {profile.role.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-xs text-gray-500 sm:inline">
              Logged in as <strong className="text-gray-700">{profile.email}</strong>
            </span>
            <Link
              href="/account"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-xs hover:bg-gray-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Customer View
            </Link>
          </div>
        </div>

        {/* Secondary Subnav */}
        <div className="border-t border-gray-100 bg-white">
          <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <Package className="h-4 w-4" />
              Products
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <ShoppingCart className="h-4 w-4" />
              Orders
            </Link>
            <Link
              href="/admin/inventory"
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <Boxes className="h-4 w-4" />
              Inventory
            </Link>
            <Link
              href="/admin/delivery"
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <MapPin className="h-4 w-4" />
              Delivery Zones
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
