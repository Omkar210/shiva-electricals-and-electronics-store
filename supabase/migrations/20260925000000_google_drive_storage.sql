-- ==============================================================================
-- Shiva Electrical & Electronics — Google Drive & External Storage Metadata Migration
-- Migration: 20260925000000_google_drive_storage.sql
-- ==============================================================================

-- 1. Add storage provider and metadata fields to product_images
ALTER TABLE public.product_images
  ADD COLUMN IF NOT EXISTS storage_provider TEXT NOT NULL DEFAULT 'supabase',
  ADD COLUMN IF NOT EXISTS external_id TEXT,
  ADD COLUMN IF NOT EXISTS file_size_bytes BIGINT,
  ADD COLUMN IF NOT EXISTS mime_type TEXT,
  ADD COLUMN IF NOT EXISTS file_metadata JSONB DEFAULT '{}'::jsonb;

-- 2. Index to accelerate provider lookups and cleanup tasks
CREATE INDEX IF NOT EXISTS idx_product_images_provider 
  ON public.product_images(storage_provider);

CREATE INDEX IF NOT EXISTS idx_product_images_external_id 
  ON public.product_images(external_id);
