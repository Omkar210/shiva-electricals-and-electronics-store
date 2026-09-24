"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { handleAddToCart } from "@/app/cart/actions";
import { ShoppingCart, Check, Plus, Minus, ArrowRight, Loader2 } from "lucide-react";

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
        setTimeout(() => setJustAdded(false), 2500);
      }
    });
  };

  if (!isInStock) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center text-xs font-semibold text-gray-500">
        This item is currently out of stock. Please check back later or call the store to request restock.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Quantity Stepper */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-gray-700">Quantity:</span>
        <div className="flex items-center rounded-lg border border-gray-300 bg-white p-1">
          <button
            type="button"
            disabled={quantity <= 1 || isPending}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-7 w-7 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-40"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-8 text-center text-xs font-bold text-gray-900">
            {quantity}
          </span>
          <button
            type="button"
            disabled={quantity >= stockQuantity || isPending}
            onClick={() => setQuantity((q) => Math.min(stockQuantity, q + 1))}
            className="flex h-7 w-7 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-40"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
        <span className="text-[11px] text-gray-500">
          ({stockQuantity} available)
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <button
          type="button"
          disabled={isPending}
          onClick={() => onAdd(false)}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all shadow-xs ${
            justAdded
              ? "bg-emerald-600 text-white"
              : "border border-blue-600 bg-white text-blue-600 hover:bg-blue-50"
          } disabled:opacity-50`}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : justAdded ? (
            <>
              <Check className="h-4 w-4" />
              <span>Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              <span>Add to Cart</span>
            </>
          )}
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => onAdd(true)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
        >
          <span>Buy Now</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
