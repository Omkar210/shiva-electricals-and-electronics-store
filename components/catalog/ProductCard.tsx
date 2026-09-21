import Link from "next/link";
import Image from "next/image";
import type { ProductItem } from "@/lib/catalog/products";
import { Check, X, ShoppingCart, Eye } from "lucide-react";

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
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
      <div>
        {/* Product Image Area */}
        <Link
          href={`/products/${product.slug}`}
          className="relative block aspect-4/3 w-full overflow-hidden bg-gray-50"
        >
          {product.primary_image ? (
            <Image
              src={product.primary_image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              No Image Available
            </div>
          )}

          {/* Discount Badge */}
          {hasDiscount && (
            <span className="absolute left-3 top-3 rounded-md bg-rose-600 px-2 py-1 text-[11px] font-bold text-white shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
        </Link>

        {/* Content Body */}
        <div className="p-4 sm:p-5">
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] font-medium text-gray-500">
            <span>{product.brands?.name || "Shiva Electrical"}</span>
            <span className="text-blue-600">{product.categories?.name}</span>
          </div>

          {/* Product Title */}
          <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug text-gray-900 group-hover:text-blue-600">
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h3>

          {/* Pricing */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.mrp!.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Stock Status Badge */}
          <div className="mt-2.5 flex items-center gap-1.5 text-xs">
            {isInStock ? (
              <span className="flex items-center gap-1 font-medium text-emerald-700">
                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                In stock ({product.stock_quantity} available)
              </span>
            ) : (
              <span className="flex items-center gap-1 font-medium text-rose-600">
                <X className="h-3.5 w-3.5 stroke-[2.5]" />
                Out of stock
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="border-t border-gray-100 bg-gray-50/50 p-3">
        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white py-2 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 hover:text-gray-900"
          >
            <Eye className="h-3.5 w-3.5" />
            Details
          </Link>

          <Link
            href={`/products/${product.slug}#order`}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold text-white shadow-xs ${
              isInStock
                ? "bg-blue-600 hover:bg-blue-700"
                : "cursor-not-allowed bg-gray-400"
            }`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
}
