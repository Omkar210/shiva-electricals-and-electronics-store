-- ==============================================================================
-- Shiva Electrical & Electronics — Concurrency-Safe Order Placement RPC
-- Migration: 20260924000000_order_placement_rpc.sql
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.place_order_atomic(
  p_user_id UUID,
  p_order_number TEXT,
  p_address_snapshot JSONB,
  p_subtotal NUMERIC,
  p_delivery_fee NUMERIC,
  p_discount NUMERIC,
  p_total NUMERIC,
  p_items JSONB
)
RETURNS UUID AS $$
DECLARE
  v_order_id UUID;
  v_item JSONB;
  v_product_id UUID;
  v_qty INTEGER;
  v_unit_price NUMERIC;
  v_name_snapshot TEXT;
  v_sku_snapshot TEXT;
  v_subtotal NUMERIC;
  v_remaining_stock INTEGER;
BEGIN
  -- 1. Validate items payload
  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Cannot place an order with no items.';
  END IF;

  -- 2. Verify stock and decrement inventory atomically with concurrency protection
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'product_id')::UUID;
    v_qty := (v_item->>'quantity')::INTEGER;

    IF v_qty <= 0 THEN
      RAISE EXCEPTION 'Invalid quantity for item %', v_product_id;
    END IF;

    -- Concurrency check: Update only if stock is sufficient and product is active
    UPDATE public.products
    SET stock_quantity = stock_quantity - v_qty
    WHERE id = v_product_id
      AND stock_quantity >= v_qty
      AND is_active = true
    RETURNING stock_quantity INTO v_remaining_stock;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product % is unavailable or has insufficient stock to fulfill order.', v_product_id;
    END IF;
  END LOOP;

  -- 3. Insert authoritative order record
  INSERT INTO public.orders (
    order_number,
    user_id,
    delivery_address_snapshot,
    subtotal,
    delivery_fee,
    discount,
    total,
    payment_status,
    order_status
  )
  VALUES (
    p_order_number,
    p_user_id,
    p_address_snapshot,
    p_subtotal,
    p_delivery_fee,
    p_discount,
    p_total,
    'PENDING',
    'PLACED'
  )
  RETURNING id INTO v_order_id;

  -- 4. Insert order items & inventory audit logs
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'product_id')::UUID;
    v_qty := (v_item->>'quantity')::INTEGER;
    v_unit_price := (v_item->>'unit_price')::NUMERIC;
    v_name_snapshot := v_item->>'product_name_snapshot';
    v_sku_snapshot := v_item->>'sku_snapshot';
    v_subtotal := (v_item->>'subtotal')::NUMERIC;

    -- Insert snapshot item
    INSERT INTO public.order_items (
      order_id,
      product_id,
      product_name_snapshot,
      sku_snapshot,
      unit_price,
      quantity,
      subtotal
    )
    VALUES (
      v_order_id,
      v_product_id,
      v_name_snapshot,
      v_sku_snapshot,
      v_unit_price,
      v_qty,
      v_subtotal
    );

    -- Insert inventory transaction audit trail
    INSERT INTO public.inventory_transactions (
      product_id,
      quantity_change,
      transaction_type,
      reason,
      reference_id,
      created_by
    )
    VALUES (
      v_product_id,
      -v_qty,
      'SALE',
      'Order placed: ' || p_order_number,
      v_order_id::TEXT,
      p_user_id
    );
  END LOOP;

  -- 5. Insert initial status history
  INSERT INTO public.order_status_history (
    order_id,
    old_status,
    new_status,
    changed_by,
    note
  )
  VALUES (
    v_order_id,
    NULL,
    'PLACED',
    p_user_id,
    'Order created via storefront checkout.'
  );

  -- 6. Clear user cart if authenticated
  IF p_user_id IS NOT NULL THEN
    DELETE FROM public.cart_items
    WHERE cart_id IN (
      SELECT id FROM public.carts WHERE user_id = p_user_id
    );
  END IF;

  RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
