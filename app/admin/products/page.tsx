import { createClient } from "@/lib/supabase/server";
import { Plus, Package } from "lucide-react";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, sku, price, stock_quantity, is_active, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">Manage catalog items, pricing, and availability</p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add New Product
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
        {products && products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-3.5">Product Name</th>
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
                    <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                    <td className="px-6 py-4 text-xs font-mono text-gray-500">{p.sku}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">₹{p.price.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4 text-gray-700">{p.stock_quantity} units</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          p.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {p.is_active ? "Active" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-medium text-blue-600 hover:underline">
                        Edit
                      </button>
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
