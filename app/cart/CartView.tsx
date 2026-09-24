"use client";

import { useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  handleUpdateQuantity,
  handleRemoveItem,
  handleClearCart,
} from "./actions";
import type { CartState } from "@/lib/cart/service";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  AlertTriangle,
  Truck,
  ShieldCheck,
} from "lucide-react";

interface CartViewProps {
  initialCart: CartState;
}

export default function CartView({ initialCart }: CartViewProps) {
  const [isPending, startTransition] = useTransition();

  const onUpdateQty = (productId: string, newQty: number) => {
    startTransition(async () => {
      await handleUpdateQuantity(productId, newQty);
    });
  };

  const onRemove = (productId: string) => {
    startTransition(async () => {
      await handleRemoveItem(productId);
    });
  };

  const onClear = () => {
    startTransition(async () => {
      await handleClearCart();
    });
  };

  if (initialCart.items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-dashed border-gray-300 bg-gray-50/50 p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-gray-900">Your Cart is Empty</h2>
        <p className="mt-2 text-xs text-gray-500 sm:text-sm">
          Browse our certified RO purifiers, genuine spare filters, fans, and electrical accessories to add items to your cart.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
          >
            Explore Catalog
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/products?category=ro-spare-parts"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50"
          >
            Browse RO Spares
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Items Column */}
      <div className="space-y-4 lg:col-span-8">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Shopping Cart ({initialCart.itemCount} {initialCart.itemCount === 1 ? "item" : "items"})
          </h1>
          <button
            type="button"
            onClick={onClear}
            disabled={isPending}
            className="text-xs font-medium text-gray-500 hover:text-red-600 disabled:opacity-50"
          >
            Clear Cart
          </button>
        </div>

        {initialCart.hasOutOfStock && (
          <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
            <p>
              Some items in your cart exceed current available inventory. Please adjust quantities before proceeding to checkout.
            </p>
          </div>
        )}

        <div className="divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white shadow-xs">
          {initialCart.items.map((item) => {
            const product = item.product!;
            const isExceeded = item.quantity > item.maxAvailable;

            return (
              <div key={item.productId} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    {product.primary_image ? (
                      <Image
                        src={product.primary_image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
                      {product.categories?.name}
                    </span>
                    <h3 className="text-sm font-semibold text-gray-900 hover:text-blue-600">
                      <Link href={`/products/${product.slug}`}>{product.name}</Link>
                    </h3>
                    <p className="text-xs text-gray-500 font-mono">SKU: {product.sku}</p>
                    <p className="text-xs font-bold text-gray-900 sm:hidden">
                      ₹{product.price.toLocaleString("en-IN")} each
                    </p>

                    {isExceeded && (
                      <p className="text-[11px] font-semibold text-rose-600">
                        Only {item.maxAvailable} available in stock
                      </p>
                    )}
                  </div>
                </div>

                {/* Price, Stepper & Controls */}
                <div className="flex items-center justify-between gap-6 border-t border-gray-100 pt-3 sm:border-0 sm:pt-0">
                  {/* Quantity Stepper */}
                  <div className="flex items-center rounded-lg border border-gray-300 bg-gray-50/50 p-1">
                    <button
                      type="button"
                      disabled={isPending || item.quantity <= 1}
                      onClick={() => onUpdateQty(item.productId, item.quantity - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-gray-600 shadow-xs hover:bg-gray-100 disabled:opacity-40"
                    >
                      <Minus className="h-3 w-3" />
                    </button>

                    <span className="w-9 text-center text-xs font-bold text-gray-900">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      disabled={isPending || item.quantity >= item.maxAvailable}
                      onClick={() => onUpdateQty(item.productId, item.quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-gray-600 shadow-xs hover:bg-gray-100 disabled:opacity-40"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">
                      ₹{item.lineTotal.toLocaleString("en-IN")}
                    </div>
                    <div className="hidden text-[11px] text-gray-400 sm:block">
                      ₹{product.price.toLocaleString("en-IN")} × {item.quantity}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => onRemove(item.productId)}
                    className="p-1.5 text-gray-400 hover:text-red-600 disabled:opacity-50"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Summary Sidebar */}
      <div className="space-y-4 lg:col-span-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-gray-900">Order Summary</h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Items Subtotal</span>
              <span className="font-semibold text-gray-900">
                ₹{initialCart.subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Local Delivery Charge</span>
              <span className="font-medium text-emerald-700">Calculated at checkout</span>
            </div>

            <div className="border-t border-gray-100 pt-3 flex justify-between text-sm font-bold text-gray-900">
              <span>Estimated Subtotal</span>
              <span className="text-base text-blue-600">
                ₹{initialCart.subtotal.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="space-y-2 rounded-xl bg-blue-50/60 p-3.5 text-xs text-gray-600">
            <div className="flex items-center gap-2 font-semibold text-blue-800">
              <Truck className="h-4 w-4 text-blue-600" />
              <span>Doorstep Delivery Available</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Serving local town and nearby regions with same-day and scheduled delivery options.
            </p>
          </div>

          <Link
            href={initialCart.hasOutOfStock ? "#" : "/checkout"}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white shadow-sm transition-colors ${
              initialCart.hasOutOfStock
                ? "cursor-not-allowed bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600"
            }`}
          >
            Proceed to Checkout
            <ArrowRight className="h-4 w-4" />
          </Link>

          <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Pay on Delivery (COD) supported</span>
          </div>
        </div>
      </div>
    </div>
  );
}
