import { getCart } from "@/lib/cart/service";
import CartView from "./CartView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "View and manage items in your shopping cart at Shiva Electrical & Electronics.",
};

export default async function CartPage() {
  const cart = await getCart();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <CartView initialCart={cart} />
    </div>
  );
}
