"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";

export function GuestOrderLookup() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = orderNumber.trim();
    if (!cleanNumber) {
      setError("Please enter your Order Number.");
      return;
    }

    setIsLoading(true);
    router.push(`/orders/${encodeURIComponent(cleanNumber)}`);
  };

  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-5 w-5 text-blue-700" />
        <h3 className="font-bold text-slate-900 text-base">
          Track an Order
        </h3>
      </div>
      <p className="text-sm text-slate-600">
        Enter the Order Number from your confirmation SMS or receipt (e.g. <span className="font-mono font-bold text-slate-800">SE-20260924-4821</span>).
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="order-lookup-input" className="sr-only">
            Order Number
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="order-lookup-input"
              type="text"
              value={orderNumber}
              onChange={(e) => {
                setOrderNumber(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. SE-20260924-4821"
              aria-label="Order Number for tracking"
              className="h-12 flex-1 rounded-lg border-2 border-slate-300 px-4 text-base text-slate-900 uppercase font-mono tracking-wider focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 text-base font-bold text-white shadow-xs hover:bg-blue-800 disabled:opacity-50 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <span>Track Order</span>
              )}
            </button>
          </div>
        </div>
      </form>

      {error && <p className="text-sm font-bold text-red-700">{error}</p>}
    </div>
  );
}
