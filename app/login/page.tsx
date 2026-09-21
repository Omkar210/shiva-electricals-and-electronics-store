"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { login, type AuthActionResult } from "@/app/auth/actions";
import { LogIn, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";
  const errorParam = searchParams.get("error");

  const [state, formAction, isPending] = useActionState<AuthActionResult | null, FormData>(
    login,
    null,
  );

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-lg shadow-gray-100/50">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <LogIn className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Log in to manage your orders, delivery address, and account
          </p>
        </div>

        {errorParam === "auth_callback_failed" && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>The authentication link was invalid or has expired. Please log in directly.</span>
          </div>
        )}

        {state?.error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        <form action={formAction} className="mt-8 space-y-5">
          <input type="hidden" name="redirect" value={redirectUrl} />

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
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
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 sm:text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
          >
            {isPending ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
