-- ==============================================================================
-- Shiva Electrical & Electronics — Product Media Storage Migration
-- Migration: 20260922000001_storage_setup.sql
-- ==============================================================================

-- 1. Create product-images storage bucket if it does not already exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Row Level Security Policies
-- Allow anyone to view public product images
CREATE POLICY "Public Access for Product Images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Allow authenticated staff/admins to upload product images
CREATE POLICY "Admin Upload Product Images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images'
    AND public.is_staff_or_admin()
  );

-- Allow authenticated staff/admins to update product images
CREATE POLICY "Admin Update Product Images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'product-images'
    AND public.is_staff_or_admin()
  );

-- Allow authenticated staff/admins to delete product images
CREATE POLICY "Admin Delete Product Images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'product-images'
    AND public.is_admin()
  );
