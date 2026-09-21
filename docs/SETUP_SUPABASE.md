# Supabase Integration & Setup Guide

This document describes how Supabase is configured for **Shiva Electrical & Electronics**, including client types, environment variables, and security boundaries.

---

## 1. Client Architecture

We implement three distinct clients using `@supabase/ssr` and `@supabase/supabase-js`:

| Client | Path | Security Context | Use Case |
|---|---|---|---|
| **Browser Client** | `lib/supabase/client.ts` | Uses `anon` key, scoped to browser session | Client components, client-side event handlers |
| **Server Client** | `lib/supabase/server.ts` | Uses `anon` key + user session cookies via `@supabase/ssr` | Server components, Server Actions, Route Handlers (enforces RLS) |
| **Admin Client** | `lib/supabase/admin.ts` | Uses `SUPABASE_SERVICE_ROLE_KEY` (guarded by `import "server-only"`) | High-privilege tasks (admin mutations, background jobs, webhooks). **Bypasses RLS**. Never exposed to client. |

In addition, `middleware.ts` (using `lib/supabase/middleware.ts`) automatically intercepts incoming requests to refresh expired session tokens before rendering pages.

---

## 2. Environment Variables

Configure these variables in `.env.local` for development, and in the Vercel project dashboard for production:

```bash
# Supabase Project URL (found in Project Settings -> API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Supabase Anonymous Key (safe for browser)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Supabase Service Role Key (SERVER ONLY - NEVER SHARE OR COMMIT)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Application URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> [!CAUTION]
> `SUPABASE_SERVICE_ROLE_KEY` must **never** be prefixed with `NEXT_PUBLIC_` and must **never** be committed to Git or imported in Client Components.

---

## 3. Row Level Security (RLS) Policy Principle

Every table in PostgreSQL will have RLS enabled:
- **Public reads**: Catalog tables (`products`, `categories`, `brands`, `delivery_zones`) can be read publicly where `is_active = true`.
- **Customer data**: `profiles`, `addresses`, `carts`, `cart_items`, `orders` are strictly accessible only by the owning `auth.uid()`.
- **Admin data**: Managed via server authorization checking the user's role in `profiles` (`role = 'admin'`).

---

## 4. Verification Check

To verify Supabase connectivity:
1. Copy `.env.example` to `.env.local` and fill in your Supabase credentials.
2. Run `npm run dev` or `npm run build`.
3. The application will connect securely using the established clients.
