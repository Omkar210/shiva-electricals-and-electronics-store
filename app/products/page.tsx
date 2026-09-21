import Link from "next/link";
import { getCategories } from "@/lib/catalog/categories";
import { getProducts } from "@/lib/catalog/products";
import ProductCard from "@/components/catalog/ProductCard";
import SearchFilterBar from "@/components/catalog/SearchFilterBar";
import { SearchX, ArrowLeft } from "lucide-react";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const categorySlug = typeof resolvedParams.category === "string" ? resolvedParams.category : undefined;
  const query = typeof resolvedParams.q === "string" ? resolvedParams.q : undefined;
  const rawSort = typeof resolvedParams.sort === "string" ? resolvedParams.sort : undefined;
  const sort = rawSort === "price_asc" || rawSort === "price_desc" || rawSort === "newest" ? rawSort : "newest";
  const inStockOnly = resolvedParams.inStock === "true";

  const [categories, { products, total }] = await Promise.all([
    getCategories(),
    getProducts({
      categorySlug,
      query,
      sort,
      inStockOnly,
      limit: 50,
    }),
  ]);

  const activeCategoryName = categories.find((c) => c.slug === categorySlug)?.name;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Products</span>
          {activeCategoryName && (
            <>
              <span>/</span>
              <span className="text-blue-600 font-semibold">{activeCategoryName}</span>
            </>
          )}
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          {activeCategoryName || "All Products"}
        </h1>
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Showing {products.length} of {total} available items
        </p>
      </div>

      {/* Filter and Search Bar */}
      <SearchFilterBar categories={categories} />

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        /* Zero Results Guidance per Section 8 of DESIGN.md */
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-12 text-center">
          <SearchX className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-base font-bold text-gray-900">
            No products found matching your search
          </h2>
          <p className="mx-auto mt-1 max-w-md text-xs text-gray-500">
            Try checking spelling, removing active filters, or browsing other categories.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Reset All Filters
            </Link>

            <Link
              href="/products?category=ro-spare-parts"
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
            >
              Browse RO Spare Parts
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
