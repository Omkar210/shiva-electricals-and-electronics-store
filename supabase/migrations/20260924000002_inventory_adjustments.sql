-- ==============================================================================
-- Shiva Electrical & Electronics — Concurrency-Safe Inventory Adjustments RPC
-- Migration: 20260924000002_inventory_adjustments.sql
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.adjust_product_inventory(
  p_product_id UUID,
  p_quantity_change INTEGER,
  p_transaction_type TEXT,
  p_reason TEXT,
  p_reference_id TEXT DEFAULT NULL,
  p_created_by UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_product RECORD;
  v_old_stock INTEGER;
  v_new_stock INTEGER;
BEGIN
  -- 1. Validate inputs
  IF p_quantity_change = 0 THEN
    RAISE EXCEPTION 'Quantity change cannot be zero.';
  END IF;

  IF p_transaction_type NOT IN ('PURCHASE', 'SALE', 'ADJUSTMENT', 'RETURN', 'DAMAGE') THEN
    RAISE EXCEPTION 'Invalid transaction type %', p_transaction_type;
  END IF;

  IF p_reason IS NULL OR TRIM(p_reason) = '' THEN
    RAISE EXCEPTION 'A valid reason must be specified for every inventory adjustment.';
  END IF;

  -- 2. Lock product row to prevent race conditions during concurrent stock updates
  SELECT id, name, sku, stock_quantity, low_stock_threshold
  INTO v_product
  FROM public.products
  WHERE id = p_product_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product with ID % not found.', p_product_id;
  END IF;

  v_old_stock := v_product.stock_quantity;
  v_new_stock := v_old_stock + p_quantity_change;

  IF v_new_stock < 0 THEN
    RAISE EXCEPTION 'Insufficient inventory. Cannot reduce stock by % when current stock is %.', ABS(p_quantity_change), v_old_stock;
  END IF;

  -- 3. Update stock quantity
  UPDATE public.products
  SET stock_quantity = v_new_stock,
      updated_at = NOW()
  WHERE id = p_product_id;

  -- 4. Record immutable transaction log
  INSERT INTO public.inventory_transactions (
    product_id,
    quantity_change,
    transaction_type,
    reason,
    reference_id,
    created_by
  ) VALUES (
    p_product_id,
    p_quantity_change,
    p_transaction_type,
    p_reason,
    p_reference_id,
    p_created_by
  );

  -- 5. Record system audit log
  INSERT INTO public.audit_logs (
    actor_id,
    action,
    entity_type,
    entity_id,
    metadata
  ) VALUES (
    p_created_by,
    'INVENTORY_ADJUSTMENT',
    'products',
    p_product_id::TEXT,
    jsonb_build_object(
      'product_name', v_product.name,
      'sku', v_product.sku,
      'old_stock', v_old_stock,
      'new_stock', v_new_stock,
      'quantity_change', p_quantity_change,
      'transaction_type', p_transaction_type,
      'reason', p_reason,
      'reference_id', p_reference_id
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'product_id', p_product_id,
    'product_name', v_product.name,
    'sku', v_product.sku,
    'old_stock', v_old_stock,
    'new_stock', v_new_stock,
    'quantity_change', p_quantity_change
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
