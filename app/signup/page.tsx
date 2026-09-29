"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup, type AuthActionResult } from "@/app/auth/actions";
import { UserPlus, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState<AuthActionResult | null, FormData>(
    signup,
    null,
  );

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 rounded-xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-800">
            <UserPlus className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Create an Account
          </h1>
          <p className="text-base text-slate-600">
            Register for fast local delivery, order tracking, and technician assistance
          </p>
        </div>

        {state?.error && (
          <div className="flex items-start gap-2.5 rounded-lg border-2 border-red-300 bg-red-50 p-4 text-sm font-semibold text-red-900">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-700 mt-0.5" />
            <span>{state.error}</span>
          </div>
        )}

        {state?.success && (
          <div className="flex items-start gap-2.5 rounded-lg border-2 border-emerald-300 bg-emerald-50 p-4 text-sm font-semibold text-emerald-950">
            <CheckCircle className="h-5 w-5 shrink-0 text-emerald-700 mt-0.5" />
            <span>{state.success}</span>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-bold text-slate-800 mb-1"
            >
              Full Name *
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              className="h-12 w-full rounded-lg border-2 border-slate-300 px-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
              placeholder="e.g. Ramesh Kumar"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-bold text-slate-800 mb-1"
            >
              Mobile Phone Number (for Delivery Driver)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="h-12 w-full rounded-lg border-2 border-slate-300 px-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
              placeholder="10-digit mobile number"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold text-slate-800 mb-1"
            >
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="h-12 w-full rounded-lg border-2 border-slate-300 px-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-bold text-slate-800 mb-1"
            >
              Choose a Password (minimum 6 characters) *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              className="h-12 w-full rounded-lg border-2 border-slate-300 px-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
              placeholder="Enter password"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-bold text-slate-800 mb-1"
            >
              Confirm Password *
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              className="h-12 w-full rounded-lg border-2 border-slate-300 px-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
              placeholder="Re-enter password"
            />
          </div>

          {/* Form Consent Checkbox (DPDP Act & CPA Rules Compliant) */}
          <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-3.5 space-y-1">
            <label htmlFor="signup-consent" className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                id="signup-consent"
                name="consent"
                required
                className="mt-1 h-5 w-5 rounded border-2 border-slate-400 text-blue-700 focus:ring-2 focus:ring-blue-700 cursor-pointer shrink-0"
              />
              <span className="text-sm font-medium text-slate-700 leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" target="_blank" className="font-bold text-blue-700 underline hover:text-blue-800">
                  Terms &amp; Conditions
                </Link>{" "}
                and consent to data processing under the{" "}
                <Link href="/privacy-policy" target="_blank" className="font-bold text-blue-700 underline hover:text-blue-800">
                  Privacy Policy (DPDP Act 2023)
                </Link>
                . <span className="text-red-700 font-bold">*</span>
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 text-base font-bold text-white shadow-xs hover:bg-blue-800 active:bg-blue-900 disabled:opacity-50 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-700"
          >
            {isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create New Account</span>
            )}
          </button>
        </form>

        <div className="border-t border-slate-200 pt-4 text-center text-sm font-medium text-slate-700 space-y-2">
          <p>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-blue-700 hover:underline"
            >
              Log in directly
            </Link>
          </p>
          <p className="text-xs text-slate-500">
            Need help signing up? Call shop support at{" "}
            <a href="tel:+919876543210" className="font-bold text-slate-800 underline">
              +91 98765 43210
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
