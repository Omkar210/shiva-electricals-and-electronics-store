import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/roles";
import type { ProductItem, ProductQueryResult } from "@/lib/catalog/products";

const GUEST_CART_COOKIE = "se_guest_cart";

export interface CartLineItem {
  productId: string;
  quantity: number;
  product: ProductItem | null;
  lineTotal: number;
  inStock: boolean;
  maxAvailable: number;
}

export interface CartState {
  items: CartLineItem[];
  itemCount: number;
  subtotal: number;
  hasOutOfStock: boolean;
}

interface RawCartItem {
  productId: string;
  quantity: number;
}

/**
 * Reads the guest cart cookie.
 */
async function getGuestCartItems(): Promise<RawCartItem[]> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(GUEST_CART_COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (i) => i && typeof i.productId === "string" && typeof i.quantity === "number" && i.quantity > 0,
      );
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Saves items to the guest cart cookie.
 */
async function saveGuestCartItems(items: RawCartItem[]) {
  const cookieStore = await cookies();
  if (items.length === 0) {
    cookieStore.delete(GUEST_CART_COOKIE);
  } else {
    cookieStore.set(GUEST_CART_COOKIE, JSON.stringify(items), {
      path: "/",
      maxAge: 60 * 60 * 24 * 14, // 14 days
      sameSite: "lax",
      httpOnly: true,
    });
  }
}

/**
 * Gets or creates the database cart for an authenticated user.
 */
async function getOrCreateUserCartId(userId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data: existingCart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (existingCart) return existingCart.id;

  const { data: newCart, error } = await supabase
    .from("carts")
    .insert({ user_id: userId })
    .select("id")
    .single();

  if (error || !newCart) return null;
  return newCart.id;
}

/**
 * Fetches the user's authoritative cart state with fresh product data.
 */
export async function getCart(): Promise<CartState> {
  const user = await getCurrentUser();
  const supabase = await createClient();

  let rawItems: RawCartItem[] = [];

  if (user) {
    const cartId = await getOrCreateUserCartId(user.id);
    if (cartId) {
      // Check if guest cart had items and sync them
      const guestItems = await getGuestCartItems();
      if (guestItems.length > 0) {
        for (const gi of guestItems) {
          await supabase.from("cart_items").upsert(
            {
              cart_id: cartId,
              product_id: gi.productId,
              quantity: gi.quantity,
            },
            { onConflict: "cart_id,product_id" },
          );
        }
        await saveGuestCartItems([]); // Clear guest cookie after sync
      }

      const { data: dbItems } = await supabase
        .from("cart_items")
        .select("product_id, quantity")
        .eq("cart_id", cartId);

      rawItems = (dbItems || []).map((di) => ({
        productId: di.product_id,
        quantity: di.quantity,
      }));
    }
  } else {
    rawItems = await getGuestCartItems();
  }

  if (rawItems.length === 0) {
    return { items: [], itemCount: 0, subtotal: 0, hasOutOfStock: false };
  }

  // Fetch authoritative product data for all item IDs
  const productIds = rawItems.map((i) => i.productId);
  const { data: productsData } = await supabase
    .from("products")
    .select(
      `
        id,
        category_id,
        brand_id,
        name,
        slug,
        sku,
        description,
        price,
        mrp,
        stock_quantity,
        low_stock_threshold,
        compatibility,
        warranty,
        is_active,
        created_at,
        updated_at,
        categories ( name, slug ),
        brands ( name, slug ),
        product_images ( id, storage_path, alt_text, is_primary )
      `,
    )
    .in("id", productIds);

  const productMap = new Map<string, ProductItem>();
  for (const item of (productsData || []) as unknown as ProductQueryResult[]) {
    const images = item.product_images || [];
    const primary =
      images.find((img) => img.is_primary)?.storage_path || images[0]?.storage_path || null;
    productMap.set(item.id, {
      ...item,
      primary_image: primary,
    });
  }

  let subtotal = 0;
  let itemCount = 0;
  let hasOutOfStock = false;

  const items: CartLineItem[] = rawItems
    .map((raw) => {
      const product = productMap.get(raw.productId) || null;
      if (!product || !product.is_active) {
        return {
          productId: raw.productId,
          quantity: raw.quantity,
          product: null,
          lineTotal: 0,
          inStock: false,
          maxAvailable: 0,
        };
      }

      const inStock = product.stock_quantity >= raw.quantity;
      if (!inStock) hasOutOfStock = true;

      const lineTotal = product.price * raw.quantity;
      subtotal += lineTotal;
      itemCount += raw.quantity;

      return {
        productId: raw.productId,
        quantity: raw.quantity,
        product,
        lineTotal,
        inStock,
        maxAvailable: product.stock_quantity,
      };
    })
    .filter((i) => i.product !== null); // Discard deleted products

  return {
    items,
    itemCount,
    subtotal,
    hasOutOfStock,
  };
}

/**
 * Add product to cart.
 */
export async function addToCart(productId: string, quantity = 1): Promise<void> {
  const user = await getCurrentUser();
  const supabase = await createClient();

  if (user) {
    const cartId = await getOrCreateUserCartId(user.id);
    if (!cartId) return;

    // Check existing item
    const { data: existing } = await supabase
      .from("cart_items")
      .select("quantity")
      .eq("cart_id", cartId)
      .eq("product_id", productId)
      .single();

    const newQuantity = (existing?.quantity || 0) + quantity;

    await supabase.from("cart_items").upsert(
      {
        cart_id: cartId,
        product_id: productId,
        quantity: newQuantity,
      },
      { onConflict: "cart_id,product_id" },
    );
  } else {
    const items = await getGuestCartItems();
    const idx = items.findIndex((i) => i.productId === productId);
    if (idx >= 0) {
      items[idx].quantity += quantity;
    } else {
      items.push({ productId, quantity });
    }
    await saveGuestCartItems(items);
  }
}

/**
 * Update quantity for a cart item.
 */
export async function updateCartItemQuantity(productId: string, quantity: number): Promise<void> {
  const user = await getCurrentUser();
  const supabase = await createClient();

  if (quantity <= 0) {
    await removeFromCart(productId);
    return;
  }

  if (user) {
    const cartId = await getOrCreateUserCartId(user.id);
    if (!cartId) return;

    await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("cart_id", cartId)
      .eq("product_id", productId);
  } else {
    const items = await getGuestCartItems();
    const item = items.find((i) => i.productId === productId);
    if (item) {
      item.quantity = quantity;
      await saveGuestCartItems(items);
    }
  }
}

/**
 * Remove an item from the cart.
 */
export async function removeFromCart(productId: string): Promise<void> {
  const user = await getCurrentUser();
  const supabase = await createClient();

  if (user) {
    const cartId = await getOrCreateUserCartId(user.id);
    if (!cartId) return;

    await supabase
      .from("cart_items")
      .delete()
      .eq("cart_id", cartId)
      .eq("product_id", productId);
  } else {
    const items = await getGuestCartItems();
    const filtered = items.filter((i) => i.productId !== productId);
    await saveGuestCartItems(filtered);
  }
}

/**
 * Clears the user's cart.
 */
export async function clearCart(): Promise<void> {
  const user = await getCurrentUser();
  const supabase = await createClient();

  if (user) {
    const cartId = await getOrCreateUserCartId(user.id);
    if (cartId) {
      await supabase.from("cart_items").delete().eq("cart_id", cartId);
    }
  }
  await saveGuestCartItems([]);
}

/**
 * Quick item count calculation for the Navbar badge.
 */
export async function getCartItemCount(): Promise<number> {
  const cart = await getCart();
  return cart.itemCount;
}
