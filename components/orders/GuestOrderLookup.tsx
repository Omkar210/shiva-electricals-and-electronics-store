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
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-5 w-5 text-blue-600" />
        <h3 className="font-bold text-gray-900 text-sm">
          Track an Order
        </h3>
      </div>
      <p className="text-xs text-gray-500">
        Enter the Order Number from your confirmation SMS or receipt (e.g. <span className="font-mono font-semibold text-gray-700">SE-20260924-4821</span>).
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={orderNumber}
          onChange={(e) => {
            setOrderNumber(e.target.value);
            if (error) setError(null);
          }}
          placeholder="SE-YYYYMMDD-XXXX"
          className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-xs text-gray-900 uppercase font-mono tracking-wider focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Searching...
            </>
          ) : (
            "Track Order"
          )}
        </button>
      </form>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
