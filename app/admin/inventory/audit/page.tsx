import Link from "next/link";
import { requireStaffOrAdmin } from "@/lib/auth/roles";
import { getInventoryTransactions } from "@/lib/inventory/service";
import {
  ArrowLeft,
  History,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  RotateCcw,
  AlertOctagon,
  Boxes,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventory Audit Trail — Admin Portal",
};

interface AuditPageProps {
  searchParams: Promise<{ productId?: string }>;
}

export default async function InventoryAuditPage({
  searchParams,
}: AuditPageProps) {
  await requireStaffOrAdmin("/admin/inventory");
  const { productId } = await searchParams;

  const transactions = await getInventoryTransactions(productId, 100);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/admin/inventory"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Inventory Dashboard
        </Link>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Inventory Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Immutable transaction records for all stock inward, sales deductions, returns, and manual adjustments.
          </p>
        </div>

        {productId && (
          <Link
            href="/admin/inventory/audit"
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
          >
            Clear Product Filter (Show All Logs)
          </Link>
        )}
      </div>

      {/* Transactions Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        {transactions.length === 0 ? (
          <div className="p-12 text-center">
            <History className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-3 text-sm font-bold text-gray-900">No Transactions Recorded</h3>
            <p className="mt-1 text-xs text-gray-500">
              Inventory movements will be logged automatically upon purchases, sales, and manual adjustments.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
              <thead className="bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <tr>
                  <th scope="col" className="px-5 py-3.5">Date &amp; Time</th>
                  <th scope="col" className="px-4 py-3.5">Product</th>
                  <th scope="col" className="px-4 py-3.5">Type</th>
                  <th scope="col" className="px-4 py-3.5">Change</th>
                  <th scope="col" className="px-5 py-3.5">Reason &amp; Remarks</th>
                  <th scope="col" className="px-4 py-3.5">Reference ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {transactions.map((tx) => {
                  const isPositive = tx.quantity_change > 0;

                  return (
                    <tr key={tx.id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Timestamp */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-gray-500 font-mono text-[11px]">
                        <div>
                          {new Date(tx.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <div className="text-gray-400">
                          {new Date(tx.created_at).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>

                      {/* Product */}
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-gray-900">
                          {tx.product?.name || "Product"}
                        </div>
                        <div className="text-[11px] font-mono text-gray-400">
                          SKU: {tx.product?.sku || tx.product_id.slice(0, 8)}
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {tx.transaction_type === "PURCHASE" && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200">
                            <TrendingUp className="h-3 w-3" />
                            Purchase Inward
                          </span>
                        )}
                        {tx.transaction_type === "SALE" && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-800 border border-blue-200">
                            <ShoppingBag className="h-3 w-3" />
                            Order Sale
                          </span>
                        )}
                        {tx.transaction_type === "RETURN" && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-teal-800 border border-teal-200">
                            <RotateCcw className="h-3 w-3" />
                            Stock Restored
                          </span>
                        )}
                        {tx.transaction_type === "DAMAGE" && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-800 border border-red-200">
                            <AlertOctagon className="h-3 w-3" />
                            Damage / Write-Off
                          </span>
                        )}
                        {tx.transaction_type === "ADJUSTMENT" && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-[11px] font-bold text-purple-800 border border-purple-200">
                            <Boxes className="h-3 w-3" />
                            Audit Adjustment
                          </span>
                        )}
                      </td>

                      {/* Quantity Delta */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-0.5 font-black text-xs ${
                            isPositive ? "text-emerald-600" : "text-red-600"
                          }`}
                        >
                          {isPositive ? (
                            <TrendingUp className="h-3.5 w-3.5" />
                          ) : (
                            <TrendingDown className="h-3.5 w-3.5" />
                          )}
                          {isPositive ? `+${tx.quantity_change}` : tx.quantity_change}
                        </span>
                      </td>

                      {/* Reason */}
                      <td className="px-5 py-3.5 text-gray-700">
                        {tx.reason}
                      </td>

                      {/* Reference */}
                      <td className="px-4 py-3.5 text-gray-500 font-mono text-[11px]">
                        {tx.reference_id || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
