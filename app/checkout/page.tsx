import { redirect } from "next/navigation";
import { getCart } from "@/lib/cart/service";
import { getCurrentProfile } from "@/lib/auth/roles";
import CheckoutForm from "./CheckoutForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order with local doorstep delivery from Shiva Electrical & Electronics.",
};

export default async function CheckoutPage() {
  const [cart, profile] = await Promise.all([
    getCart(),
    getCurrentProfile(),
  ]);

  if (cart.items.length === 0) {
    redirect("/cart");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <CheckoutForm cart={cart} profile={profile} />
    </div>
  );
}
