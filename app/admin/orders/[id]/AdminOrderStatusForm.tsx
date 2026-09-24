"use client";

import { useState, useTransition } from "react";
import { adminTransitionOrderStatusAction } from "@/app/admin/orders/actions";
import { Loader2, RefreshCw } from "lucide-react";

interface AdminOrderStatusFormProps {
  orderId: string;
  currentStatus: string;
  currentPaymentStatus: string;
}

const ALLOWED_NEXT_STATUSES: Record<string, { value: string; label: string }[]> = {
  PLACED: [
    { value: "CONFIRMED", label: "CONFIRMED — Accept & Verify Order" },
    { value: "CANCELLED", label: "CANCELLED — Cancel Order & Restore Stock" },
  ],
  CONFIRMED: [
    { value: "PACKED", label: "PACKED — Boxed & Ready for Dispatch" },
    { value: "CANCELLED", label: "CANCELLED — Cancel Order & Restore Stock" },
  ],
  PACKED: [
    { value: "OUT_FOR_DELIVERY", label: "OUT_FOR_DELIVERY — Dispatched to Driver" },
    { value: "CANCELLED", label: "CANCELLED — Cancel Order & Restore Stock" },
  ],
  OUT_FOR_DELIVERY: [
    { value: "DELIVERED", label: "DELIVERED — Successfully Delivered to Customer" },
    { value: "FAILED", label: "FAILED — Delivery Attempt Failed" },
    { value: "CANCELLED", label: "CANCELLED — Cancel Order & Restore Stock" },
  ],
  DELIVERED: [],
  CANCELLED: [],
  FAILED: [
    { value: "OUT_FOR_DELIVERY", label: "OUT_FOR_DELIVERY — Re-dispatch Delivery" },
    { value: "CANCELLED", label: "CANCELLED — Cancel Order & Restore Stock" },
  ],
};

export function AdminOrderStatusForm({
  orderId,
  currentStatus,
  currentPaymentStatus,
}: AdminOrderStatusFormProps) {
  const allowedTransitions = ALLOWED_NEXT_STATUSES[currentStatus] || [];
  const isTerminal = allowedTransitions.length === 0;

  const [selectedStatus, setSelectedStatus] = useState(
    allowedTransitions.length > 0 ? allowedTransitions[0].value : currentStatus,
  );
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await adminTransitionOrderStatusAction(
        orderId,
        selectedStatus,
        note.trim() || undefined,
        paymentStatus,
      );

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setNote("");
        setTimeout(() => setSuccess(false), 3000);
      }
    });
  };

  if (isTerminal && currentPaymentStatus === "PAID") {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4 text-xs text-gray-500">
        This order is in terminal state ({currentStatus}) and fully paid. No further status transitions are available.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200">
          Order updated successfully.
        </div>
      )}

      {/* Status Selector */}
      {allowedTransitions.length > 0 && (
        <div className="space-y-1">
          <label htmlFor="new-status" className="block text-xs font-semibold text-gray-700">
            Transition Status
          </label>
          <select
            id="new-status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            disabled={isPending}
            className="w-full rounded-xl border border-gray-300 p-2.5 text-xs text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
          >
            {allowedTransitions.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Payment Status */}
      <div className="space-y-1">
        <label htmlFor="payment-status" className="block text-xs font-semibold text-gray-700">
          Payment Status
        </label>
        <select
          id="payment-status"
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          disabled={isPending}
          className="w-full rounded-xl border border-gray-300 p-2.5 text-xs text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
        >
          <option value="PENDING">PENDING — Unpaid (Collect on Delivery)</option>
          <option value="PAID">PAID — Cash or UPI Received</option>
          <option value="FAILED">FAILED — Payment Failed</option>
          <option value="REFUNDED">REFUNDED — Refund Processed</option>
        </select>
      </div>

      {/* Internal Staff Note */}
      <div className="space-y-1">
        <label htmlFor="audit-note" className="block text-xs font-semibold text-gray-700">
          Audit Note / Operational Remarks
        </label>
        <textarea
          id="audit-note"
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Verified customer by phone call; Dispatched with delivery vehicle #4"
          disabled={isPending}
          className="w-full rounded-xl border border-gray-300 p-2.5 text-xs text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
      >
        {isPending ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Updating Order...
          </>
        ) : (
          <>
            <RefreshCw className="h-3.5 w-3.5" />
            Save &amp; Transition Status
          </>
        )}
      </button>
    </form>
  );
}
