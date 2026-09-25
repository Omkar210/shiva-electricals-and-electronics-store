-- ==============================================================================
-- Shiva Electrical & Electronics — Restrict Image Uploads Strictly to Admin
-- Migration: 20260925000001_restrict_media_upload_to_admin.sql
-- ==============================================================================

-- 1. Restrict Supabase Storage 'product-images' upload & update strictly to admin
DROP POLICY IF EXISTS "Admin Upload Product Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Product Images" ON storage.objects;

-- Strictly allow only authenticated Admins to insert images (excluding staff, customers, guests)
CREATE POLICY "Strict Admin Upload Product Images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images'
    AND public.is_admin()
  );

-- Strictly allow only authenticated Admins to update images
CREATE POLICY "Strict Admin Update Product Images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'product-images'
    AND public.is_admin()
  );

-- 2. Ensure product_images table write policies strictly require admin
DROP POLICY IF EXISTS "Admin write product images" ON public.product_images;

CREATE POLICY "Strict Admin write product images"
  ON public.product_images FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
