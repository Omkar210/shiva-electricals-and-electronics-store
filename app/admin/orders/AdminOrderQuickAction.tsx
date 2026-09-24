"use client";

import { useTransition } from "react";
import { adminTransitionOrderStatusAction } from "@/app/admin/orders/actions";
import { Check, Package, Truck, CheckCircle2, Loader2 } from "lucide-react";

interface AdminOrderQuickActionProps {
  orderId: string;
  currentStatus: string;
}

export function AdminOrderQuickAction({
  orderId,
  currentStatus,
}: AdminOrderQuickActionProps) {
  const [isPending, startTransition] = useTransition();

  const handleAction = (nextStatus: string, paymentStatus?: string) => {
    startTransition(async () => {
      await adminTransitionOrderStatusAction(
        orderId,
        nextStatus,
        `Quick advance to ${nextStatus}`,
        paymentStatus,
      );
    });
  };

  switch (currentStatus) {
    case "PLACED":
      return (
        <button
          type="button"
          onClick={() => handleAction("CONFIRMED")}
          disabled={isPending}
          className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-50 cursor-pointer"
        >
          {isPending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Check className="h-3 w-3" />
          )}
          Confirm
        </button>
      );
    case "CONFIRMED":
      return (
        <button
          type="button"
          onClick={() => handleAction("PACKED")}
          disabled={isPending}
          className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 cursor-pointer"
        >
          {isPending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Package className="h-3 w-3" />
          )}
          Pack
        </button>
      );
    case "PACKED":
      return (
        <button
          type="button"
          onClick={() => handleAction("OUT_FOR_DELIVERY")}
          disabled={isPending}
          className="inline-flex items-center gap-1 rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 hover:bg-purple-100 disabled:opacity-50 cursor-pointer"
        >
          {isPending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Truck className="h-3 w-3" />
          )}
          Dispatch
        </button>
      );
    case "OUT_FOR_DELIVERY":
      return (
        <button
          type="button"
          onClick={() => handleAction("DELIVERED", "PAID")}
          disabled={isPending}
          className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 cursor-pointer"
        >
          {isPending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <CheckCircle2 className="h-3 w-3" />
          )}
          Deliver
        </button>
      );
    default:
      return null;
  }
}
