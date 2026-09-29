"use client";

import { useState, useEffect, useTransition } from "react";
import { cancelCustomerOrderAction } from "@/app/orders/actions";
import { XCircle, Loader2, AlertTriangle, X } from "lucide-react";

interface CancelOrderButtonProps {
  orderNumber: string;
}

export function CancelOrderButton({ orderNumber }: CancelOrderButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isPending) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isPending]);

  const handleCancel = () => {
    setError(null);
    startTransition(async () => {
      const result = await cancelCustomerOrderAction(orderNumber, reason);
      if (result.error) {
        setError(result.error);
      } else {
        setIsOpen(false);
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-11 items-center gap-2 rounded-lg border-2 border-red-300 bg-white px-4 text-sm font-bold text-red-700 shadow-2xs hover:bg-red-50 hover:border-red-400 focus-visible:outline-2 focus-visible:outline-red-700 cursor-pointer transition-colors"
      >
        <XCircle className="h-4 w-4" />
        <span>Cancel This Order</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-2xl border-2 border-slate-200 bg-white p-6 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 text-red-700">
                <div className="rounded-xl bg-red-100 p-2.5">
                  <AlertTriangle className="h-6 w-6 text-red-700" />
                </div>
                <div>
                  <h3 id="cancel-modal-title" className="text-lg font-bold text-slate-900">
                    Cancel Order?
                  </h3>
                  <p className="text-xs font-bold text-slate-500 font-mono">Order #{orderNumber}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                aria-label="Close cancel dialog"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">
              Are you sure you want to cancel this order? Once cancelled, reserved stock will be released back to the store inventory. This action cannot be undone.
            </p>

            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-800 border-2 border-red-200">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="cancel-reason" className="block text-sm font-bold text-slate-800">
                Reason for Cancellation (Optional)
              </label>
              <textarea
                id="cancel-reason"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Changed my mind, Ordered wrong model, Address needs updating..."
                className="w-full rounded-lg border-2 border-slate-300 p-3 text-base text-slate-900 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="h-11 rounded-lg border-2 border-slate-300 px-5 text-sm font-bold text-slate-700 hover:bg-slate-100 hover:border-slate-400 cursor-pointer transition-colors"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isPending}
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-red-700 px-5 text-sm font-bold text-white shadow-xs hover:bg-red-800 cursor-pointer disabled:opacity-50 transition-colors focus-visible:outline-2 focus-visible:outline-red-700"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <span>Confirm Cancellation</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
