import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/roles";
import { revalidatePath } from "next/cache";

export interface ProductImageRecord {
  id: string;
  storage_path: string;
  alt_text: string | null;
  is_primary: boolean;
}

export interface ProductQueryResult {
  id: string;
  category_id: string | null;
  brand_id: string | null;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  price: number;
  mrp: number | null;
  stock_quantity: number;
  low_stock_threshold: number;
  compatibility: string | null;
  warranty: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  categories?: { name: string; slug: string } | null;
  brands?: { name: string; slug: string } | null;
  product_images?: ProductImageRecord[];
}

export interface ProductItem {
  id: string;
  category_id: string | null;
  brand_id: string | null;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  price: number;
  mrp: number | null;
  stock_quantity: number;
  low_stock_threshold: number;
  compatibility: string | null;
  warranty: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  categories?: { name: string; slug: string } | null;
  brands?: { name: string; slug: string } | null;
  images?: ProductImageRecord[];
  primary_image?: string | null;
}

export interface ProductQueryOptions {
  categorySlug?: string;
  brandSlug?: string;
  query?: string;
  inStockOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price_asc" | "price_desc";
  limit?: number;
  offset?: number;
  onlyActive?: boolean;
}

/**
 * High-performance product listing with filtering, pagination, and sorting.
 */
export async function getProducts(options: ProductQueryOptions = {}): Promise<{ products: ProductItem[]; total: number }> {
  const {
    categorySlug,
    query: searchQuery,
    inStockOnly = false,
    minPrice,
    maxPrice,
    sort = "newest",
    limit = 20,
    offset = 0,
    onlyActive = true,
  } = options;

  const supabase = await createClient();

  let dbQuery = supabase
    .from("products")
    .select(
      `
        id,
        category_id,
        brand_id,
        name,
        slug,
        sku,
        description,
        price,
        mrp,
        stock_quantity,
        low_stock_threshold,
        compatibility,
        warranty,
        is_active,
        created_at,
        updated_at,
        categories ( name, slug ),
        brands ( name, slug ),
        product_images ( id, storage_path, alt_text, is_primary )
      `,
      { count: "exact" },
    );

  if (onlyActive) {
    dbQuery = dbQuery.eq("is_active", true);
  }

  if (inStockOnly) {
    dbQuery = dbQuery.gt("stock_quantity", 0);
  }

  if (minPrice !== undefined) {
    dbQuery = dbQuery.gte("price", minPrice);
  }

  if (maxPrice !== undefined) {
    dbQuery = dbQuery.lte("price", maxPrice);
  }

  if (searchQuery) {
    // Search across name, description, and SKU
    dbQuery = dbQuery.or(
      `name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,sku.ilike.%${searchQuery}%`,
    );
  }

  // Category filter
  if (categorySlug) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();

    if (category) {
      dbQuery = dbQuery.eq("category_id", category.id);
    }
  }

  // Sorting
  if (sort === "price_asc") {
    dbQuery = dbQuery.order("price", { ascending: true });
  } else if (sort === "price_desc") {
    dbQuery = dbQuery.order("price", { ascending: false });
  } else {
    dbQuery = dbQuery.order("created_at", { ascending: false });
  }

  dbQuery = dbQuery.range(offset, offset + limit - 1);

  const { data, count, error } = await dbQuery;

  if (error) {
    console.error("Error fetching products:", error);
    return { products: [], total: 0 };
  }

  // Map primary image helper
  const products: ProductItem[] = ((data as unknown as ProductQueryResult[]) || []).map((item) => {
    const images = item.product_images || [];
    const primary = images.find((img) => img.is_primary)?.storage_path || images[0]?.storage_path || null;
    return {
      ...item,
      categories: item.categories,
      brands: item.brands,
      images,
      primary_image: primary,
    };
  });

  return { products, total: count ?? 0 };
}

/**
 * Fetch a single product by unique slug with category, brand, and images.
 */
export async function getProductBySlug(slug: string): Promise<ProductItem | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `
        id,
        category_id,
        brand_id,
        name,
        slug,
        sku,
        description,
        price,
        mrp,
        stock_quantity,
        low_stock_threshold,
        compatibility,
        warranty,
        is_active,
        created_at,
        updated_at,
        categories ( name, slug ),
        brands ( name, slug ),
        product_images ( id, storage_path, alt_text, is_primary )
      `,
    )
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return null;
  }

  const raw = data as unknown as ProductQueryResult;
  const images = raw.product_images || [];
  const primary = images.find((img) => img.is_primary)?.storage_path || images[0]?.storage_path || null;

  return {
    ...raw,
    categories: raw.categories,
    brands: raw.brands,
    images,
    primary_image: primary,
  };
}

/**
 * Fetch featured products for the storefront homepage.
 */
export async function getFeaturedProducts(limit = 6): Promise<ProductItem[]> {
  const { products } = await getProducts({ limit, onlyActive: true });
  return products;
}

/**
 * Fetch related products in the same category.
 */
export async function getRelatedProducts(productId: string, categoryId: string | null, limit = 4): Promise<ProductItem[]> {
  if (!categoryId) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `
        id,
        category_id,
        brand_id,
        name,
        slug,
        sku,
        description,
        price,
        mrp,
        stock_quantity,
        low_stock_threshold,
        compatibility,
        warranty,
        is_active,
        created_at,
        updated_at,
        categories ( name, slug ),
        brands ( name, slug ),
        product_images ( id, storage_path, alt_text, is_primary )
      `,
    )
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .neq("id", productId)
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return ((data as unknown as ProductQueryResult[]) || []).map((item) => {
    const images = item.product_images || [];
    const primary = images.find((img) => img.is_primary)?.storage_path || images[0]?.storage_path || null;
    return {
      ...item,
      categories: item.categories,
      brands: item.brands,
      images,
      primary_image: primary,
    };
  });
}

/**
 * Admin Action: Create new product.
 */
export async function createProduct(formData: FormData) {
  await requireRole(["admin"]);
  const supabase = await createClient();

  const name = (formData.get("name") as string)?.trim();
  const sku = (formData.get("sku") as string)?.trim().toUpperCase();
  const categoryId = (formData.get("categoryId") as string) || null;
  const brandId = (formData.get("brandId") as string) || null;
  const description = (formData.get("description") as string)?.trim() || null;
  const price = parseFloat(formData.get("price") as string);
  const mrpInput = formData.get("mrp") as string;
  const mrp = mrpInput ? parseFloat(mrpInput) : null;
  const stockQuantity = parseInt((formData.get("stockQuantity") as string) || "0", 10);
  const lowStockThreshold = parseInt((formData.get("lowStockThreshold") as string) || "5", 10);
  const compatibility = (formData.get("compatibility") as string)?.trim() || null;
  const warranty = (formData.get("warranty") as string)?.trim() || null;
  const slug =
    (formData.get("slug") as string)?.trim().toLowerCase() ||
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  if (!name || !sku || isNaN(price)) {
    throw new Error("Product name, SKU, and a valid price are required.");
  }

  const { data: newProduct, error } = await supabase
    .from("products")
    .insert({
      name,
      slug,
      sku,
      category_id: categoryId,
      brand_id: brandId,
      description,
      price,
      mrp,
      stock_quantity: stockQuantity,
      low_stock_threshold: lowStockThreshold,
      compatibility,
      warranty,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create product: ${error.message}`);
  }

  // Record initial inventory transaction
  if (stockQuantity > 0 && newProduct) {
    await supabase.from("inventory_transactions").insert({
      product_id: newProduct.id,
      quantity_change: stockQuantity,
      transaction_type: "PURCHASE",
      reason: "Initial stock upon product creation",
    });
  }

  revalidatePath("/", "layout");
  return newProduct;
}

/**
 * Admin Action: Toggle product active state.
 */
export async function toggleProductActive(id: string, isActive: boolean) {
  await requireRole(["admin", "staff"]);
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to toggle product status: ${error.message}`);
  }

  revalidatePath("/", "layout");
}
