CREATE OR REPLACE FUNCTION public.register_remaining_payment(
  p_appointment_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_appointment public.appointments%ROWTYPE;
  v_paid_amount numeric;
  v_remaining numeric;
  v_payment_id uuid;
BEGIN
  -- Comprobar permisos de administrador
  IF NOT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role IN ('admin', 'superadmin')
  ) THEN
    RAISE EXCEPTION 'No tienes permisos para registrar pagos';
  END IF;

  -- Bloquear la reserva durante la operación
  SELECT *
  INTO v_appointment
  FROM public.appointments
  WHERE id = p_appointment_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No se ha encontrado la reserva';
  END IF;

  IF v_appointment.status <> 'confirmed' THEN
    RAISE EXCEPTION 'La reserva no está confirmada';
  END IF;

  -- Calcular los pagos ya aprobados
  SELECT COALESCE(SUM(amount), 0)
  INTO v_paid_amount
  FROM public.payments
  WHERE appointment_id = p_appointment_id
    AND status = 'approved';

  v_remaining := v_appointment.price_snapshot - v_paid_amount;

  IF v_remaining <= 0 THEN
    RAISE EXCEPTION 'La reserva ya está completamente pagada';
  END IF;

  -- Registrar el importe pendiente
  INSERT INTO public.payments (
    appointment_id,
    amount,
    currency,
    payment_type,
    status,
    provider,
    provider_reference,
    created_at,
    paid_at
  )
  VALUES (
    p_appointment_id,
    v_remaining,
    'EUR',
    'remaining',
    'approved',
    'manual',
    'MANUAL-' || gen_random_uuid()::text,
    NOW(),
    NOW()
  )
  RETURNING id INTO v_payment_id;

  -- Completar la reserva
  UPDATE public.appointments
  SET status = 'completed'
  WHERE id = p_appointment_id;

  RETURN jsonb_build_object(
    'success', true,
    'payment_id', v_payment_id,
    'amount', v_remaining,
    'message', 'Pago restante registrado y reserva completada'
  );
END;
$$;

REVOKE ALL ON FUNCTION public.register_remaining_payment(uuid)
FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.register_remaining_payment(uuid)
TO authenticated;