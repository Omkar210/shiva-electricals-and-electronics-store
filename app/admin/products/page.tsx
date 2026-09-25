import Link from "next/link";
import { getProducts } from "@/lib/catalog/products";
import AdminProductsTable from "./AdminProductsTable";
import DriveSyncButton from "@/components/admin/DriveSyncButton";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const { products } = await getProducts({ onlyActive: false, limit: 100 });

  return (
    <div className="space-y-6">
      {/* Top Header & Google Drive Sync Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Products Catalog</h1>
          <p className="text-xs text-gray-500">
            Primary storage: <strong className="text-blue-600">Google Drive</strong> (accessed by Product ID)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <DriveSyncButton />
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add New Product
          </Link>
        </div>
      </div>

      {/* Products Table with Google Drive Image integration */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
        <AdminProductsTable products={products || []} />
      </div>
    </div>
  );
}
