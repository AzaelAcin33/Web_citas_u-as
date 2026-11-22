CREATE OR REPLACE FUNCTION public.confirm_stripe_appointment_payment(
    p_payment_id UUID,
    p_appointment_id UUID,
    p_session_id TEXT,
    p_amount_cents INTEGER,
    p_currency TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_payment RECORD;
    v_appointment RECORD;
BEGIN
    SELECT *
    INTO v_payment
    FROM public.payments
    WHERE id = p_payment_id
      AND appointment_id = p_appointment_id
      AND provider = 'stripe'
      AND payment_type = 'deposit'
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el pago correspondiente.';
    END IF;

    -- Permitir reintentos del mismo webhook sin duplicar el pago.
    IF v_payment.status = 'approved'
       AND v_payment.provider_reference = p_session_id THEN
        RETURN TRUE;
    END IF;

    IF v_payment.status <> 'pending' THEN
        RAISE EXCEPTION 'El pago no está pendiente.';
    END IF;

    IF ROUND(v_payment.amount * 100)::INTEGER <> p_amount_cents
       OR LOWER(v_payment.currency) <> LOWER(p_currency) THEN
        RAISE EXCEPTION 'El importe o la moneda no coinciden.';
    END IF;

    SELECT *
    INTO v_appointment
    FROM public.appointments
    WHERE id = p_appointment_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró la reserva.';
    END IF;

    IF v_appointment.status <> 'pending_payment'
       OR v_appointment.expires_at <= NOW() THEN
        RAISE EXCEPTION 'La reserva ha caducado o ya no está pendiente.';
    END IF;

    UPDATE public.payments
    SET status = 'approved',
        provider_reference = p_session_id,
        paid_at = NOW()
    WHERE id = p_payment_id;

    UPDATE public.appointments
    SET status = 'confirmed'
    WHERE id = p_appointment_id;

    RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.confirm_stripe_appointment_payment(
    UUID, UUID, TEXT, INTEGER, TEXT
) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.confirm_stripe_appointment_payment(
    UUID, UUID, TEXT, INTEGER, TEXT
) TO service_role;