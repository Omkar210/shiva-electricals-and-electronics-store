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
  Package,
  PhoneCall,
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
      <div className="mx-auto max-w-2xl rounded-2xl border-2 border-dashed border-slate-300 bg-white p-8 sm:p-12 text-center space-y-4 shadow-2xs">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Your Shopping Cart is Empty</h2>
        <p className="text-base text-slate-600 max-w-md mx-auto leading-relaxed">
          You have not added any purifiers, spare filter sets, or electrical appliances to your cart yet.
        </p>
        <div className="pt-4 flex flex-wrap justify-center gap-3">
          <Link
            href="/products"
            className="flex h-12 items-center gap-2 rounded-lg bg-blue-700 px-6 text-base font-bold text-white shadow-xs hover:bg-blue-800 transition-colors"
          >
            <span>Browse Catalog</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <a
            href="tel:+919876543210"
            className="flex h-12 items-center gap-2 rounded-lg border-2 border-slate-300 bg-white px-5 text-base font-bold text-slate-800 hover:bg-slate-50 transition-colors"
          >
            <PhoneCall className="h-5 w-5 text-blue-700" />
            <span>Call Shop for Help</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Items Column */}
      <div className="space-y-5 lg:col-span-8">
        <div className="flex items-center justify-between border-b-2 border-slate-200 pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Shopping Cart ({initialCart.itemCount} {initialCart.itemCount === 1 ? "item" : "items"})
          </h1>
          <button
            type="button"
            onClick={onClear}
            disabled={isPending}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-bold text-slate-600 hover:text-red-700 hover:border-red-300 disabled:opacity-50 transition-colors cursor-pointer"
          >
            Empty Cart
          </button>
        </div>

        {initialCart.hasOutOfStock && (
          <div className="flex items-start gap-3 rounded-xl border-2 border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-700 mt-0.5" />
            <p className="font-semibold">
              Some items in your cart exceed our current shop stock. Please adjust quantities before proceeding to checkout.
            </p>
          </div>
        )}

        <div className="divide-y-2 divide-slate-100 rounded-xl border-2 border-slate-200 bg-white shadow-xs">
          {initialCart.items.map((item) => {
            const product = item.product!;
            const isExceeded = item.quantity > item.maxAvailable;

            return (
              <div key={item.productId} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 border-slate-200 bg-slate-50">
                    {product.primary_image ? (
                      <Image
                        src={product.primary_image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                        <Package className="h-6 w-6 text-slate-300" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                      {product.categories?.name}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 hover:text-blue-700">
                      <Link href={`/products/${product.slug}`}>{product.name}</Link>
                    </h3>
                    <p className="text-sm text-slate-500 font-mono">SKU: {product.sku}</p>
                    <p className="text-base font-bold text-slate-900 sm:hidden">
                      ₹{product.price.toLocaleString("en-IN")} each
                    </p>

                    {isExceeded && (
                      <p className="text-sm font-bold text-red-700">
                        ⚠️ Only {item.maxAvailable} available in store
                      </p>
                    )}
                  </div>
                </div>

                {/* Price, Stepper & Controls */}
                <div className="flex items-center justify-between gap-6 border-t border-slate-100 pt-3 sm:border-0 sm:pt-0">
                  {/* Senior-Friendly Stepper */}
                  <div className="flex items-center rounded-lg border-2 border-slate-300 bg-white p-1">
                    <button
                      type="button"
                      disabled={isPending || item.quantity <= 1}
                      onClick={() => onUpdateQty(item.productId, item.quantity - 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 disabled:opacity-30 transition-colors focus-visible:ring-2 focus-visible:ring-blue-700 outline-none"
                      aria-label={`Decrease quantity of ${product.name}`}
                    >
                      <Minus className="h-4 w-4 stroke-[2.5]" />
                    </button>

                    <span className="w-10 text-center text-base font-bold text-slate-900" aria-label={`Current quantity ${item.quantity}`}>
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      disabled={isPending || item.quantity >= item.maxAvailable}
                      onClick={() => onUpdateQty(item.productId, item.quantity + 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 disabled:opacity-30 transition-colors focus-visible:ring-2 focus-visible:ring-blue-700 outline-none"
                      aria-label={`Increase quantity of ${product.name}`}
                    >
                      <Plus className="h-4 w-4 stroke-[2.5]" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right">
                    <div className="text-lg font-extrabold text-slate-900">
                      ₹{item.lineTotal.toLocaleString("en-IN")}
                    </div>
                    <div className="hidden text-xs font-semibold text-slate-500 sm:block">
                      ₹{product.price.toLocaleString("en-IN")} × {item.quantity}
                    </div>
                  </div>

                  {/* Accessible Remove Button with Visible Text */}
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => onRemove(item.productId)}
                    className="flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:opacity-50 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-red-700 outline-none"
                    aria-label={`Remove ${product.name} from cart`}
                    title={`Remove ${product.name} from cart`}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Summary Sidebar */}
      <div className="space-y-4 lg:col-span-4">
        <div className="rounded-xl border-2 border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3">
            Order Summary
          </h2>

          <div className="space-y-3.5 text-base">
            <div className="flex justify-between text-slate-700">
              <span>Items Total</span>
              <span className="font-bold text-slate-900">
                ₹{initialCart.subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between text-slate-700">
              <span>Local Delivery Fee</span>
              <span className="font-semibold text-emerald-800">Verified at checkout</span>
            </div>

            <div className="border-t-2 border-slate-200 pt-3 flex justify-between text-lg font-extrabold text-slate-900">
              <span>Subtotal</span>
              <span className="text-2xl font-black text-blue-700">
                ₹{initialCart.subtotal.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="space-y-2 rounded-xl bg-blue-50/80 border border-blue-200 p-4 text-sm text-slate-700">
            <div className="flex items-center gap-2 font-bold text-blue-900">
              <Truck className="h-5 w-5 text-blue-700" />
              <span>Doorstep Delivery &amp; Demo</span>
            </div>
            <p className="leading-relaxed">
              We deliver locally and our technician can install and test your purifier on arrival.
            </p>
          </div>

          <Link
            href={initialCart.hasOutOfStock ? "#" : "/checkout"}
            className={`flex h-13 w-full items-center justify-center gap-2 rounded-lg text-base font-bold text-white shadow-xs transition-colors ${
              initialCart.hasOutOfStock
                ? "cursor-not-allowed bg-slate-400"
                : "bg-blue-700 hover:bg-blue-800 active:bg-blue-900"
            }`}
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="h-5 w-5" />
          </Link>

          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-600">
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
            <span>Pay on Delivery (Cash or UPI) supported</span>
          </div>
        </div>
      </div>
    </div>
  );
}
