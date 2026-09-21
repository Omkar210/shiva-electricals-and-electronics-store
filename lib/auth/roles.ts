import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";

export interface CurrentUserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
}

/**
 * Retrieves the currently authenticated Supabase user on the server.
 * Uses getUser() to cryptographically validate the JWT against Supabase Auth server.
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Retrieves the authenticated user and their profile (including role).
 */
export async function getCurrentProfile(): Promise<CurrentUserProfile | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, phone, role")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? null,
    full_name: profile?.full_name ?? (user.user_metadata?.full_name as string) ?? null,
    phone: profile?.phone ?? (user.user_metadata?.phone as string) ?? null,
    role: (profile?.role as UserRole) ?? "customer",
  };
}

/**
 * Server guard: Ensures user is logged in, redirects to login if not.
 */
export async function requireAuth(redirectTo = "/account"): Promise<CurrentUserProfile> {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect(`/login?redirect=${encodeURIComponent(redirectTo)}`);
  }
  return profile;
}

/**
 * Server guard: Ensures user is logged in and has an authorized role.
 * If not logged in, redirects to /login.
 * If logged in with insufficient role, redirects to /account with an unauthorized notice.
 */
export async function requireRole(
  allowedRoles: UserRole[],
  redirectTo = "/admin",
): Promise<CurrentUserProfile> {
  const profile = await requireAuth(redirectTo);

  if (!allowedRoles.includes(profile.role)) {
    redirect("/account?error=unauthorized_role");
  }

  return profile;
}
