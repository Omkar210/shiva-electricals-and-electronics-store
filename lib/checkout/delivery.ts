import { createClient } from "@/lib/supabase/server";

export interface DeliveryValidationResult {
  valid: boolean;
  town?: string;
  zoneName?: string;
  deliveryCharge: number;
  estimatedDelivery?: string;
  minimumOrder: number;
  error?: string;
}

/**
 * Validates a shipping pincode against authoritative delivery_zones in the database.
 */
export async function validateDeliveryZone(
  pincode: string,
  subtotal: number,
): Promise<DeliveryValidationResult> {
  const cleanPin = pincode.trim().replace(/\D/g, "");

  if (!cleanPin || cleanPin.length !== 6) {
    return {
      valid: false,
      deliveryCharge: 0,
      minimumOrder: 0,
      error: "Please enter a valid 6-digit postal pincode.",
    };
  }

  const supabase = await createClient();
  const { data: zone, error } = await supabase
    .from("delivery_zones")
    .select("town, zone_name, delivery_charge, estimated_delivery, minimum_order, is_active")
    .eq("pincode", cleanPin)
    .single();

  if (error || !zone || !zone.is_active) {
    return {
      valid: false,
      deliveryCharge: 0,
      minimumOrder: 0,
      error: `Pincode ${cleanPin} is not within our direct local delivery zone. Please contact the shop to arrange nearby town transport.`,
    };
  }

  if (zone.minimum_order > 0 && subtotal < zone.minimum_order) {
    return {
      valid: false,
      town: zone.town,
      zoneName: zone.zone_name,
      deliveryCharge: zone.delivery_charge,
      estimatedDelivery: zone.estimated_delivery,
      minimumOrder: zone.minimum_order,
      error: `Minimum order for delivery to ${zone.town} is ₹${zone.minimum_order}. Your current order subtotal is ₹${subtotal}.`,
    };
  }

  return {
    valid: true,
    town: zone.town,
    zoneName: zone.zone_name,
    deliveryCharge: Number(zone.delivery_charge),
    estimatedDelivery: zone.estimated_delivery,
    minimumOrder: Number(zone.minimum_order),
  };
}

/**
 * Returns all active delivery zones for customer visibility.
 */
export async function getActiveDeliveryZones() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("delivery_zones")
    .select("pincode, town, zone_name, delivery_charge, estimated_delivery, minimum_order")
    .eq("is_active", true)
    .order("town", { ascending: true });

  if (error) return [];
  return data || [];
}
