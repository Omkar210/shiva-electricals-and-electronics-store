export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "customer" | "staff" | "admin";

export type OrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PACKED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURN_REQUESTED"
  | "RETURNED"
  | "FAILED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type InventoryTransactionType =
  | "PURCHASE"
  | "SALE"
  | "ADJUSTMENT"
  | "RETURN"
  | "DAMAGE";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      brands: {
        Row: {
          id: string;
          name: string;
          slug: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          category_id: string | null;
          brand_id: string | null;
          name: string;
          slug: string;
          sku: string;
          description: string | null;
          price: number;
          mrp: number | null;
          stock_quantity: number;
          low_stock_threshold: number;
          compatibility: string | null;
          warranty: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          brand_id?: string | null;
          name: string;
          slug: string;
          sku: string;
          description?: string | null;
          price: number;
          mrp?: number | null;
          stock_quantity?: number;
          low_stock_threshold?: number;
          compatibility?: string | null;
          warranty?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string | null;
          brand_id?: string | null;
          name?: string;
          slug?: string;
          sku?: string;
          description?: string | null;
          price?: number;
          mrp?: number | null;
          stock_quantity?: number;
          low_stock_threshold?: number;
          compatibility?: string | null;
          warranty?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          storage_path: string;
          alt_text: string | null;
          sort_order: number;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          storage_path: string;
          alt_text?: string | null;
          sort_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          storage_path?: string;
          alt_text?: string | null;
          sort_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
      };
      inventory_transactions: {
        Row: {
          id: string;
          product_id: string;
          quantity_change: number;
          transaction_type: InventoryTransactionType;
          reason: string;
          reference_id: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          quantity_change: number;
          transaction_type: InventoryTransactionType;
          reason: string;
          reference_id?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          quantity_change?: number;
          transaction_type?: InventoryTransactionType;
          reason?: string;
          reference_id?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
      };
      delivery_zones: {
        Row: {
          id: string;
          pincode: string;
          town: string;
          zone_name: string;
          delivery_charge: number;
          estimated_delivery: string;
          minimum_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          pincode: string;
          town: string;
          zone_name: string;
          delivery_charge?: number;
          estimated_delivery: string;
          minimum_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          pincode?: string;
          town?: string;
          zone_name?: string;
          delivery_charge?: number;
          estimated_delivery?: string;
          minimum_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          phone: string;
          address_line_1: string;
          address_line_2: string | null;
          landmark: string | null;
          city: string;
          state: string;
          pincode: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          phone: string;
          address_line_1: string;
          address_line_2?: string | null;
          landmark?: string | null;
          city: string;
          state: string;
          pincode: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          phone?: string;
          address_line_1?: string;
          address_line_2?: string | null;
          landmark?: string | null;
          city?: string;
          state?: string;
          pincode?: string;
          created_at?: string;
        };
      };
      carts: {
        Row: {
          id: string;
          user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          cart_id: string;
          product_id: string;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cart_id: string;
          product_id: string;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cart_id?: string;
          product_id?: string;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string | null;
          delivery_address_snapshot: Json;
          subtotal: number;
          delivery_fee: number;
          discount: number;
          total: number;
          payment_status: PaymentStatus;
          order_status: OrderStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          user_id?: string | null;
          delivery_address_snapshot: Json;
          subtotal: number;
          delivery_fee?: number;
          discount?: number;
          total: number;
          payment_status?: PaymentStatus;
          order_status?: OrderStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          user_id?: string | null;
          delivery_address_snapshot?: Json;
          subtotal?: number;
          delivery_fee?: number;
          discount?: number;
          total?: number;
          payment_status?: PaymentStatus;
          order_status?: OrderStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name_snapshot: string;
          sku_snapshot: string;
          unit_price: number;
          quantity: number;
          subtotal: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name_snapshot: string;
          sku_snapshot: string;
          unit_price: number;
          quantity: number;
          subtotal: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          product_name_snapshot?: string;
          sku_snapshot?: string;
          unit_price?: number;
          quantity?: number;
          subtotal?: number;
        };
      };
      order_status_history: {
        Row: {
          id: string;
          order_id: string;
          old_status: OrderStatus | null;
          new_status: OrderStatus;
          changed_by: string | null;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          old_status?: OrderStatus | null;
          new_status: OrderStatus;
          changed_by?: string | null;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          old_status?: OrderStatus | null;
          new_status?: OrderStatus;
          changed_by?: string | null;
          note?: string | null;
          created_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      order_status: OrderStatus;
      payment_status: PaymentStatus;
      inventory_transaction_type: InventoryTransactionType;
    };
  };
}
