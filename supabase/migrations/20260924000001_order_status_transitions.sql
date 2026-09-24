-- ==============================================================================
-- Shiva Electrical & Electronics — Concurrency-Safe Order Status Transitions RPC
-- Migration: 20260924000001_order_status_transitions.sql
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.transition_order_status(
  p_order_id UUID,
  p_new_status TEXT,
  p_changed_by UUID,
  p_note TEXT DEFAULT NULL,
  p_payment_status TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_order RECORD;
  v_old_status TEXT;
  v_old_payment TEXT;
  v_item RECORD;
  v_is_valid_transition BOOLEAN := false;
BEGIN
  -- 1. Lock the order record for update to prevent race conditions
  SELECT id, order_number, user_id, order_status, payment_status
  INTO v_order
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found with ID %', p_order_id;
  END IF;

  v_old_status := v_order.order_status;
  v_old_payment := v_order.payment_status;

  -- 2. If status is already the same, allow optional payment status or note update only
  IF v_old_status = p_new_status THEN
    IF p_payment_status IS NOT NULL AND p_payment_status <> v_old_payment THEN
      UPDATE public.orders
      SET payment_status = p_payment_status,
          updated_at = NOW()
      WHERE id = p_order_id;

      -- Log payment update in audit logs
      INSERT INTO public.audit_logs (
        actor_id,
        action,
        entity_type,
        entity_id,
        metadata
      ) VALUES (
        p_changed_by,
        'ORDER_PAYMENT_STATUS_UPDATED',
        'orders',
        p_order_id::TEXT,
        jsonb_build_object(
          'order_number', v_order.order_number,
          'old_payment_status', v_old_payment,
          'new_payment_status', p_payment_status,
          'note', p_note
        )
      );
    END IF;

    RETURN jsonb_build_object(
      'success', true,
      'order_id', p_order_id,
      'old_status', v_old_status,
      'new_status', p_new_status,
      'payment_status', COALESCE(p_payment_status, v_old_payment)
    );
  END IF;

  -- 3. Validate state transitions strictly according to system business rules
  CASE v_old_status
    WHEN 'PLACED' THEN
      IF p_new_status IN ('CONFIRMED', 'CANCELLED') THEN
        v_is_valid_transition := true;
      END IF;
    WHEN 'CONFIRMED' THEN
      IF p_new_status IN ('PACKED', 'CANCELLED') THEN
        v_is_valid_transition := true;
      END IF;
    WHEN 'PACKED' THEN
      IF p_new_status IN ('OUT_FOR_DELIVERY', 'CANCELLED') THEN
        v_is_valid_transition := true;
      END IF;
    WHEN 'OUT_FOR_DELIVERY' THEN
      IF p_new_status IN ('DELIVERED', 'CANCELLED', 'FAILED') THEN
        v_is_valid_transition := true;
      END IF;
    WHEN 'DELIVERED' THEN
      IF p_new_status IN ('RETURN_REQUESTED') THEN
        v_is_valid_transition := true;
      END IF;
    WHEN 'RETURN_REQUESTED' THEN
      IF p_new_status IN ('RETURNED', 'DELIVERED') THEN
        v_is_valid_transition := true;
      END IF;
    ELSE
      v_is_valid_transition := false;
  END CASE;

  IF NOT v_is_valid_transition THEN
    RAISE EXCEPTION 'Invalid order status transition from % to % for order %.', v_old_status, p_new_status, v_order.order_number;
  END IF;

  -- 4. If status is being cancelled, return reserved inventory and record transactions
  IF p_new_status = 'CANCELLED' THEN
    FOR v_item IN
      SELECT product_id, quantity
      FROM public.order_items
      WHERE order_id = p_order_id AND product_id IS NOT NULL
    LOOP
      -- Restore stock quantity
      UPDATE public.products
      SET stock_quantity = stock_quantity + v_item.quantity
      WHERE id = v_item.product_id;

      -- Record inventory transaction
      INSERT INTO public.inventory_transactions (
        product_id,
        quantity_change,
        transaction_type,
        reason,
        reference_id,
        created_by
      ) VALUES (
        v_item.product_id,
        v_item.quantity,
        'RETURN',
        'Stock restored upon cancellation of order ' || v_order.order_number,
        p_order_id::TEXT,
        p_changed_by
      );
    END LOOP;
  END IF;

  -- 5. Update order status and optionally payment status
  UPDATE public.orders
  SET order_status = p_new_status,
      payment_status = COALESCE(p_payment_status, payment_status),
      updated_at = NOW()
  WHERE id = p_order_id;

  -- 6. Insert order status history entry
  INSERT INTO public.order_status_history (
    order_id,
    old_status,
    new_status,
    changed_by,
    note
  ) VALUES (
    p_order_id,
    v_old_status,
    p_new_status,
    p_changed_by,
    COALESCE(p_note, 'Status transitioned to ' || p_new_status)
  );

  -- 7. Record immutable audit log
  INSERT INTO public.audit_logs (
    actor_id,
    action,
    entity_type,
    entity_id,
    metadata
  ) VALUES (
    p_changed_by,
    'ORDER_STATUS_TRANSITION',
    'orders',
    p_order_id::TEXT,
    jsonb_build_object(
      'order_number', v_order.order_number,
      'old_status', v_old_status,
      'new_status', p_new_status,
      'payment_status', COALESCE(p_payment_status, v_old_payment),
      'note', p_note
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'order_id', p_order_id,
    'old_status', v_old_status,
    'new_status', p_new_status,
    'payment_status', COALESCE(p_payment_status, v_old_payment)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
