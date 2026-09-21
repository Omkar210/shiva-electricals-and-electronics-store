import { ShoppingCart } from "lucide-react";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500">Monitor incoming customer orders, dispatches, and deliveries</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-xs">
        <ShoppingCart className="mx-auto h-12 w-12 text-gray-300" />
        <h2 className="mt-4 text-base font-semibold text-gray-900">No Orders Yet</h2>
        <p className="mt-1 text-sm text-gray-500">Orders placed by customers will appear here for verification and packing.</p>
      </div>
    </div>
  );
}
