import { Boxes } from "lucide-react";

export default function AdminInventoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Inventory Management</h1>
        <p className="text-sm text-gray-500">Stock levels, adjustments, and immutable transaction audit logs</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-xs">
        <Boxes className="mx-auto h-12 w-12 text-gray-300" />
        <h2 className="mt-4 text-base font-semibold text-gray-900">Inventory Central</h2>
        <p className="mt-1 text-sm text-gray-500">Track real-time stock and record verified adjustments per Section 15 of rules.</p>
      </div>
    </div>
  );
}
