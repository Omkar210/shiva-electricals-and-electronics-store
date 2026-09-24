import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/catalog/categories";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shivaelectrical.in";
  const supabase = await createClient();

  const [categories, { data: products }] = await Promise.all([
    getCategories({ onlyActive: true }),
    supabase
      .from("products")
      .select("slug, updated_at")
      .eq("is_active", true),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/delivery`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/products?category=${encodeURIComponent(cat.slug)}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = (products || []).map((prod) => ({
    url: `${baseUrl}/products/${encodeURIComponent(prod.slug)}`,
    lastModified: prod.updated_at ? new Date(prod.updated_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
