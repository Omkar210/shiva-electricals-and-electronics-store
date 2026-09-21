"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup, type AuthActionResult } from "@/app/auth/actions";
import { UserPlus, AlertCircle, CheckCircle } from "lucide-react";

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState<AuthActionResult | null, FormData>(
    signup,
    null,
  );

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-lg shadow-gray-100/50">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <UserPlus className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join Shiva Electrical &amp; Electronics for easy checkout, tracking, and local delivery
          </p>
        </div>

        {state?.error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        {state?.success && (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-800">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>{state.success}</span>
          </div>
        )}

        <form action={formAction} className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name *
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 sm:text-sm"
              placeholder="e.g. Ramesh Kumar"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number (Optional)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 sm:text-sm"
              placeholder="10-digit mobile number"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 sm:text-sm"
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
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
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 sm:text-sm"
              placeholder="Re-enter password"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
          >
            {isPending ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
