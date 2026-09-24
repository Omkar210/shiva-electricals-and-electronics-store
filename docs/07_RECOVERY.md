# Shiva Electrical & Electronics --- Backup, Recovery & Operational Runbook

This document details the authoritative procedures for database recovery, media backup, deployment rollback, and migration management for **Shiva Electrical & Electronics**.

---

## 1. Database Backup & Disaster Recovery

### Automatic Backups (Supabase Managed)
- **Daily Backups**: Supabase takes daily snapshots of the PostgreSQL database, retained for 7 to 30 days depending on the project plan.
- **Point-in-Time Recovery (PITR)**: For Pro tier projects, continuous WAL archiving allows restoring the database to any millisecond within the retention window.

### Manual Database Backups (pg_dump)
To extract a self-contained, offline SQL dump of the production database prior to major schema alterations:

```bash
# Dump complete schema, tables, and transactional data
pg_dump \
  --clean \
  --if-exists \
  --quote-all-identifiers \
  --no-owner \
  --no-privileges \
  -h db.<project-ref>.supabase.co \
  -U postgres \
  -d postgres \
  -f "backup_shiva_electrical_$(date +%Y%m%d_%H%M%S).sql"
```

### Database Restoration Procedure
1. If data corruption or accidental drop occurs:
   - **Option A (Supabase Dashboard)**: Go to **Database > Backups > Restore**. Choose the closest snapshot before the incident.
   - **Option B (SQL Restore)**:
     ```bash
     psql -h db.<project-ref>.supabase.co -U postgres -d postgres -f backup_shiva_electrical_<timestamp>.sql
     ```
2. After restoration, verify RLS policies and role integrity:
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
   ```

---

## 2. Supabase Storage Recovery

### Product Media Preservation
All catalog images are stored in the Supabase Storage bucket `product-images`.

### Storage Backup Procedure
To sync all media assets locally or to a secondary cloud bucket (e.g. AWS S3 or Cloudflare R2):
```bash
# Using Supabase CLI or S3-compatible tool
supabase storage download product-images ./backups/product-images-backup/
```

### Storage Restoration
If the bucket is corrupted or media is deleted:
1. Re-create the bucket using migration:
   ```sql
   INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true)
   ON CONFLICT (id) DO NOTHING;
   ```
2. Upload the backed-up files back to the bucket using the Supabase Storage API or CLI.

---

## 3. Deployment Rollback Strategy (Vercel)

### Instant Rollback (Zero Downtime)
If an application-level bug or runtime regression slips into production:

1. Open the [Vercel Dashboard](https://vercel.com/) and navigate to the `aquapure-store` project.
2. Go to the **Deployments** tab.
3. Locate the previous stable production deployment.
4. Click the three dots (`...`) next to the deployment and select **Instant Rollback**.
5. Vercel shifts 100% of incoming production traffic to the previous immutable deployment instantly (under 5 seconds) without needing a git commit or rebuilding.

### Git Rollback
To permanently revert the repository main branch:
```bash
# Revert the faulty commit
git revert HEAD --no-edit

# Push to main to trigger normal automated build
git push origin main
```

---

## 4. Migration Rollback Strategy

All database schema evolutions reside in `supabase/migrations/` as numbered, forward-only migrations.

### Rollback Guidelines
1. **Never mutate past migrations** that have already been applied to production.
2. Always write a new compensating forward migration to roll back a change.
   - Example: If migration `20260925000000_add_column_x.sql` fails or breaks logic, create `20260925000001_remove_column_x.sql`:
     ```sql
     ALTER TABLE products DROP COLUMN IF EXISTS x;
     ```
3. **Atomic RPC Rollback**: If an RPC function needs to be reverted, overwrite the function definition with `CREATE OR REPLACE FUNCTION ...` restoring the previous logic.

---

## 5. Operational Incident Runbook

| Incident Type | First Responder Action | Resolution Path |
|---|---|---|
| **Site Down (500 Error)** | Check Vercel Deployment Logs & Status | Instant rollback on Vercel to previous deployment |
| **Database Unreachable** | Check Supabase Service Status & Connection Pooler | Verify connection string pooler port `6543` vs direct `5432` |
| **Inventory Desync** | Inspect `inventory_transactions` & `audit_logs` | Run `adjust_product_inventory` RPC with reason `'ADJUSTMENT'` |
| **Stuck Order State** | Check `order_status_history` in PostgreSQL | Use admin portal `/admin/orders/[id]` or `transition_order_status` |
