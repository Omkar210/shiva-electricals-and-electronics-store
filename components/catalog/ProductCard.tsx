import Link from "next/link";
import Image from "next/image";
import type { ProductItem } from "@/lib/catalog/products";
import { Check, X, ShoppingCart, Eye, Package } from "lucide-react";

interface ProductCardProps {
  product: ProductItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isInStock = product.stock_quantity > 0;
  const hasDiscount = product.mrp && product.mrp > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.mrp! - product.price) / product.mrp!) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border-2 border-slate-200 bg-white shadow-xs transition-shadow duration-200 hover:border-blue-400 hover:shadow-md">
      <div>
        {/* Product Image Area */}
        <Link
          href={`/products/${product.slug}`}
          className="relative block aspect-4/3 w-full overflow-hidden bg-slate-100"
          aria-label={`View details for ${product.name}`}
        >
          {product.primary_image ? (
            <Image
              src={product.primary_image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-200 group-hover:scale-102"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400">
              <Package className="h-10 w-10 text-slate-300" />
              <span className="text-sm font-medium text-slate-500">Genuine Store Stock</span>
            </div>
          )}

          {/* Discount Badge - High-Contrast Red */}
          {hasDiscount && (
            <span className="absolute left-3 top-3 rounded-md bg-red-700 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
              Save {discountPercent}%
            </span>
          )}
        </Link>

        {/* Content Body */}
        <div className="p-5">
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-sm font-bold text-slate-600">
            <span>{product.brands?.name || "Shiva Electrical"}</span>
            <span className="text-blue-700 font-semibold">{product.categories?.name}</span>
          </div>

          {/* Product Title */}
          <h3 className="mt-2 line-clamp-2 text-base sm:text-lg font-bold leading-snug text-slate-900 group-hover:text-blue-700">
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h3>

          {/* Pricing */}
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {hasDiscount && (
              <span className="text-sm text-slate-500 line-through">
                ₹{product.mrp!.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Stock Status Badge */}
          <div className="mt-3 flex items-center gap-1.5 text-sm">
            {isInStock ? (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 font-bold text-emerald-800 border border-emerald-300">
                <Check className="h-4 w-4 stroke-[3]" />
                In Stock ({product.stock_quantity} available)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-red-50 px-2.5 py-1 font-bold text-red-800 border border-red-300">
                <X className="h-4 w-4 stroke-[3]" />
                Out of Stock
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer with 44px Senior-Friendly Touch Targets */}
      <div className="border-t border-slate-200 bg-slate-50/80 p-3.5">
        <div className="grid grid-cols-2 gap-2.5">
          <Link
            href={`/products/${product.slug}`}
            className="flex h-11 items-center justify-center gap-1.5 rounded-lg border-2 border-slate-300 bg-white text-sm font-bold text-slate-800 hover:bg-slate-100 hover:border-slate-400 transition-colors"
          >
            <Eye className="h-4 w-4 text-slate-600" />
            <span>View Details</span>
          </Link>

          <Link
            href={`/products/${product.slug}#order`}
            className={`flex h-11 items-center justify-center gap-1.5 rounded-lg text-sm font-bold text-white transition-colors ${
              isInStock
                ? "bg-blue-700 hover:bg-blue-800 active:bg-blue-900 shadow-xs"
                : "cursor-not-allowed bg-slate-400"
            }`}
            aria-disabled={!isInStock}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{isInStock ? "Buy / Order" : "Unavailable"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
