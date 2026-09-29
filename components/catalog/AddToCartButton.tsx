"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { handleAddToCart } from "@/app/cart/actions";
import { ShoppingCart, Check, Plus, Minus, ArrowRight, Loader2, PhoneCall } from "lucide-react";

interface AddToCartButtonProps {
  productId: string;
  stockQuantity: number;
}

export default function AddToCartButton({
  productId,
  stockQuantity,
}: AddToCartButtonProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [justAdded, setJustAdded] = useState(false);

  const isInStock = stockQuantity > 0;

  const onAdd = (andCheckout = false) => {
    if (!isInStock || isPending) return;

    startTransition(async () => {
      await handleAddToCart(productId, quantity);
      if (andCheckout) {
        router.push("/checkout");
      } else {
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 3000);
      }
    });
  };

  if (!isInStock) {
    return (
      <div className="rounded-xl border-2 border-slate-300 bg-slate-100 p-5 text-center space-y-2">
        <p className="text-base font-bold text-slate-800">
          This product is currently out of stock
        </p>
        <p className="text-sm text-slate-600">
          You can call our shop directly to check when new shipment arrives or reserve units:
        </p>
        <a
          href="tel:+919876543210"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800"
        >
          <PhoneCall className="h-4 w-4" />
          <span>Call Shop: +91 98765 43210</span>
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Senior-Friendly 44px Quantity Stepper */}
      <div className="flex items-center gap-4">
        <span className="text-base font-bold text-slate-800">Select Quantity:</span>
        <div className="flex items-center rounded-lg border-2 border-slate-300 bg-white p-1">
          <button
            type="button"
            disabled={quantity <= 1 || isPending}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus-visible:ring-2 focus-visible:ring-blue-700 outline-none"
            aria-label="Decrease quantity"
          >
            <Minus className="h-5 w-5 stroke-[2.5]" />
          </button>
          <span className="w-12 text-center text-lg font-bold text-slate-900" aria-label={`Quantity: ${quantity}`}>
            {quantity}
          </span>
          <button
            type="button"
            disabled={quantity >= stockQuantity || isPending}
            onClick={() => setQuantity((q) => Math.min(stockQuantity, q + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus-visible:ring-2 focus-visible:ring-blue-700 outline-none"
            aria-label="Increase quantity"
          >
            <Plus className="h-5 w-5 stroke-[2.5]" />
          </button>
        </div>
        <span className="text-sm font-semibold text-slate-600">
          ({stockQuantity} available in store)
        </span>
      </div>

      {/* Action Buttons - Senior-Friendly 48px Height */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          disabled={isPending}
          onClick={() => onAdd(false)}
          className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-lg px-6 text-base font-bold transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-blue-700 outline-none cursor-pointer ${
            justAdded
              ? "bg-emerald-700 text-white"
              : "border-2 border-blue-700 bg-white text-blue-700 hover:bg-blue-50 active:bg-blue-100"
          } disabled:opacity-50`}
        >
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : justAdded ? (
            <>
              <Check className="h-5 w-5 stroke-[3]" />
              <span>Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => onAdd(true)}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 text-base font-bold text-white shadow-xs hover:bg-blue-800 active:bg-blue-900 disabled:opacity-50 transition-colors focus-visible:ring-2 focus-visible:ring-blue-700 outline-none cursor-pointer"
        >
          <span>Order Now &amp; Checkout</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      {justAdded && (
        <div className="rounded-lg border-2 border-emerald-300 bg-emerald-50 p-3 text-center text-sm font-bold text-emerald-900">
          ✓ Item added to your shopping cart. You can continue shopping or view your cart anytime.
        </div>
      )}
    </div>
  );
}
