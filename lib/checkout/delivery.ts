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
    .select("id, pincode, town, zone_name, delivery_charge, estimated_delivery, minimum_order, is_active, created_at")
    .eq("is_active", true)
    .order("town", { ascending: true });

  if (error) return [];
  return data || [];
}

export interface DeliveryZoneRecord {
  id: string;
  pincode: string;
  town: string;
  zone_name: string;
  delivery_charge: number;
  estimated_delivery: string;
  minimum_order: number;
  is_active: boolean;
  created_at: string;
}

export interface DeliveryZoneInput {
  pincode: string;
  town: string;
  zoneName: string;
  deliveryCharge: number;
  estimatedDelivery: string;
  minimumOrder: number;
  isActive: boolean;
}

/**
 * Lists all delivery zones for administrative control.
 */
export async function listAdminDeliveryZones(search?: string): Promise<DeliveryZoneRecord[]> {
  const supabase = await createClient();

  const query = supabase
    .from("delivery_zones")
    .select("id, pincode, town, zone_name, delivery_charge, estimated_delivery, minimum_order, is_active, created_at")
    .order("town", { ascending: true })
    .order("pincode", { ascending: true });

  const { data, error } = await query;

  if (error || !data) {
    console.error("Error fetching delivery zones:", error);
    return [];
  }

  let zones: DeliveryZoneRecord[] = (data as unknown as DeliveryZoneRecord[]);

  if (search?.trim()) {
    const q = search.toLowerCase().trim();
    zones = zones.filter(
      (z) =>
        z.pincode.includes(q) ||
        z.town.toLowerCase().includes(q) ||
        z.zone_name.toLowerCase().includes(q),
    );
  }

  return zones;
}

/**
 * Creates a new delivery zone.
 */
export async function createDeliveryZone(input: DeliveryZoneInput): Promise<{ success: boolean; error?: string }> {
  const cleanPin = input.pincode.trim().replace(/\D/g, "");
  if (!cleanPin || cleanPin.length !== 6) {
    return { success: false, error: "Please enter a valid 6-digit postal pincode." };
  }

  if (!input.town?.trim()) {
    return { success: false, error: "Town / Locality name is required." };
  }

  const supabase = await createClient();

  // Check if pincode already exists
  const { data: existing } = await supabase
    .from("delivery_zones")
    .select("id")
    .eq("pincode", cleanPin)
    .maybeSingle();

  if (existing) {
    return { success: false, error: `Pincode ${cleanPin} is already configured in delivery zones.` };
  }

  const { error } = await supabase.from("delivery_zones").insert({
    pincode: cleanPin,
    town: input.town.trim(),
    zone_name: input.zoneName?.trim() || "Direct Local",
    delivery_charge: Math.max(0, input.deliveryCharge || 0),
    estimated_delivery: input.estimatedDelivery?.trim() || "Same-day delivery (within 4 hours)",
    minimum_order: Math.max(0, input.minimumOrder || 0),
    is_active: input.isActive ?? true,
  });

  if (error) {
    console.error("Error creating delivery zone:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Updates an existing delivery zone.
 */
export async function updateDeliveryZone(
  id: string,
  input: DeliveryZoneInput,
): Promise<{ success: boolean; error?: string }> {
  const cleanPin = input.pincode.trim().replace(/\D/g, "");
  if (!cleanPin || cleanPin.length !== 6) {
    return { success: false, error: "Please enter a valid 6-digit postal pincode." };
  }

  if (!input.town?.trim()) {
    return { success: false, error: "Town / Locality name is required." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("delivery_zones")
    .update({
      pincode: cleanPin,
      town: input.town.trim(),
      zone_name: input.zoneName?.trim() || "Direct Local",
      delivery_charge: Math.max(0, input.deliveryCharge || 0),
      estimated_delivery: input.estimatedDelivery?.trim() || "Same-day delivery (within 4 hours)",
      minimum_order: Math.max(0, input.minimumOrder || 0),
      is_active: input.isActive,
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating delivery zone:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Toggles a delivery zone active status.
 */
export async function toggleDeliveryZoneActive(
  id: string,
  isActive: boolean,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("delivery_zones")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) {
    console.error("Error toggling delivery zone status:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Deletes a delivery zone.
 */
export async function deleteDeliveryZone(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase.from("delivery_zones").delete().eq("id", id);

  if (error) {
    console.error("Error deleting delivery zone:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

