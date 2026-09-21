import Link from "next/link";
import { getProducts } from "@/lib/catalog/products";
import { handleToggleActive } from "./actions";
import { Plus, Package, ExternalLink } from "lucide-react";

export default async function AdminProductsPage() {
  const { products } = await getProducts({ onlyActive: false, limit: 100 });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Products Catalog</h1>
          <p className="text-xs text-gray-500">Manage catalog items, pricing, inventory, and publication state</p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add New Product
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
        {products && products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-xs sm:text-sm">
              <thead className="bg-gray-50 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-3.5">Product Name</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">SKU</th>
                  <th className="px-6 py-3.5">Price</th>
                  <th className="px-6 py-3.5">Stock</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/60">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <Link
                        href={`/products/${p.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 hover:text-blue-600 hover:underline"
                      >
                        {p.name}
                        <ExternalLink className="h-3 w-3 text-gray-400" />
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      {p.categories?.name || "—"}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{p.sku}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">₹{p.price.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${
                          p.stock_quantity <= p.low_stock_threshold
                            ? "bg-amber-100 text-amber-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {p.stock_quantity} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          p.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {p.is_active ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <form action={handleToggleActive.bind(null, p.id, p.is_active)}>
                        <button
                          type="submit"
                          className="text-xs font-medium text-blue-600 hover:underline"
                        >
                          {p.is_active ? "Deactivate" : "Activate"}
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-sm font-medium text-gray-900">No products found</p>
            <p className="text-xs text-gray-500">Run seed.sql or add a product above to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
