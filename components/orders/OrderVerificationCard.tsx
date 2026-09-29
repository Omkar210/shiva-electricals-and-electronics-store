"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Phone, ArrowRight, Loader2, LogIn } from "lucide-react";
import { verifyGuestOrderAccessAction } from "@/app/orders/actions";

interface OrderVerificationCardProps {
  orderNumber: string;
}

export function OrderVerificationCard({ orderNumber }: OrderVerificationCardProps) {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.trim();

    if (!cleanPhone || cleanPhone.replace(/\D/g, "").length < 10) {
      setError("Please enter the 10-digit mobile number associated with this order.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await verifyGuestOrderAccessAction(orderNumber, cleanPhone);
      if (!result.success) {
        setError(result.error || "Verification failed. Please check the mobile number.");
        setIsLoading(false);
        return;
      }

      // Refresh the page so Server Component re-evaluates the newly set auth cookie
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg rounded-2xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Order Verification Required</h2>
          <p className="text-xs font-mono font-bold text-blue-700">Order #{orderNumber}</p>
        </div>
      </div>

      <p className="text-sm text-slate-600 leading-relaxed">
        To protect customer privacy under data protection standards and prevent unauthorized access to delivery addresses and contact information, please enter the mobile number used when placing this order.
      </p>

      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label htmlFor="verify-phone-input" className="block text-sm font-bold text-slate-900 mb-1">
            Registered Mobile Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
            <input
              id="verify-phone-input"
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. 98765 43210"
              maxLength={15}
              className="h-12 w-full rounded-lg border-2 border-slate-300 pl-11 pr-4 text-base text-slate-900 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 text-base font-bold text-white shadow-xs hover:bg-blue-800 disabled:opacity-50 transition-colors cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Verifying Access...</span>
            </>
          ) : (
            <>
              <span>Verify &amp; View Order</span>
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      <div className="border-t border-slate-100 pt-4 text-center">
        <p className="text-xs text-slate-500 mb-2">Placed this order while logged into your account?</p>
        <Link
          href={`/login?redirect=/orders/${encodeURIComponent(orderNumber)}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900"
        >
          <LogIn className="h-3.5 w-3.5" />
          <span>Sign In to your customer account</span>
        </Link>
      </div>
    </div>
  );
}
