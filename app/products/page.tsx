import Link from "next/link";
import { getCategories } from "@/lib/catalog/categories";
import { getProducts } from "@/lib/catalog/products";
import ProductCard from "@/components/catalog/ProductCard";
import SearchFilterBar from "@/components/catalog/SearchFilterBar";
import { SearchX, ArrowLeft, PhoneCall } from "lucide-react";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const categorySlug = typeof resolvedParams.category === "string" ? resolvedParams.category : undefined;
  const query = typeof resolvedParams.q === "string" 
    ? resolvedParams.q 
    : (typeof resolvedParams.search === "string" ? resolvedParams.search : undefined);
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
      {/* Accessible Breadcrumbs & Page Header */}
      <div className="space-y-2 border-b-2 border-slate-200 pb-5">
        <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-sm font-semibold text-slate-600 mb-2">
          <Link href="/" className="hover:text-blue-700 hover:underline">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">Catalog</span>
          {activeCategoryName && (
            <>
              <span>/</span>
              <span className="text-blue-700 font-bold">{activeCategoryName}</span>
            </>
          )}
        </nav>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          {activeCategoryName || "All Products & Spares"}
        </h1>
        <p className="text-base text-slate-600">
          Showing <strong className="text-slate-900">{products.length}</strong> of <strong className="text-slate-900">{total}</strong> verified items in our local inventory
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
        /* Zero Results Guidance with Senior-Friendly Recovery */
        <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-8 sm:p-12 text-center space-y-4 shadow-2xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <SearchX className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            No products matched your search
          </h2>
          <p className="mx-auto max-w-lg text-base text-slate-600 leading-relaxed">
            We might still have the part or purifier in our physical shop! You can clear filters, check all items, or call our technician directly.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/products"
              className="flex h-11 items-center gap-2 rounded-lg border-2 border-slate-300 bg-white px-5 text-sm font-bold text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Reset All Filters</span>
            </Link>

            <a
              href="tel:+919876543210"
              className="flex h-11 items-center gap-2 rounded-lg bg-blue-700 px-5 text-sm font-bold text-white hover:bg-blue-800 transition-colors shadow-xs"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Ask Shop: +91 98765 43210</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
