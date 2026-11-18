CREATE OR REPLACE FUNCTION public.create_appointment_booking(
    p_service_id UUID,
    p_starts_at TIMESTAMPTZ,
    p_full_name TEXT,
    p_email TEXT,
    p_phone TEXT,
    p_notes TEXT DEFAULT '',
    p_nail_shape TEXT DEFAULT 'Almendra de salón',
    p_needs_removal BOOLEAN DEFAULT FALSE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id UUID;
    v_customer_id UUID;
    v_service RECORD;
    v_price NUMERIC(10,2);
    v_duration INTEGER;
    v_deposit NUMERIC(10,2);
    v_ends_at TIMESTAMPTZ;
    v_local_start TIMESTAMP;
    v_local_end TIMESTAMP;
    v_weekday INTEGER;
    v_opens_at TIME;
    v_closes_at TIME;
    v_is_closed BOOLEAN;
    v_appointment_id UUID;
    v_payment_id UUID;
    v_notes TEXT;
    v_auth_email TEXT;
BEGIN
    -- Comprobar los datos
    IF p_full_name IS NULL OR LENGTH(TRIM(p_full_name)) < 2 THEN
        RAISE EXCEPTION 'Introduce tu nombre completo.';
    END IF;

    IF p_phone IS NULL OR LENGTH(TRIM(p_phone)) < 6 THEN
        RAISE EXCEPTION 'Introduce tu télefono.';
    END IF;

    IF p_starts_at IS NULL OR p_starts_at <= NOW() THEN
        RAISE EXCEPTION 'Selecciona una fecha y hora futuras.';
    END IF;

    -- Liberar reservas caducadas
    PERFORM public.cancel_expired_appointments();

    -- Obtener servicio
    SELECT id, name, price, duration_minutes
    INTO v_service
    FROM public.services
    WHERE id = p_service_id
        AND is_active = TRUE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'El servicio seleccionado no está disponible';
    END IF;

    -- Calcular precio y duración reales
    v_price := v_service.price;
    v_duration := v_service.duration_minutes;

    IF p_needs_removal THEN
        v_price := v_price + 10;
        v_duration := v_duration + 20;
    END IF;

    v_deposit := ROUND(v_price * 0.50, 2);

    v_ends_at := p_starts_at
        + MAKE_INTERVAL(mins => v_duration);

    -- Convertir a la hora local
    v_local_start := p_starts_at AT TIME ZONE 'Europe/Madrid';
    v_local_end := p_ends_at AT TIME ZONE 'Europe/Madrid';

    -- Evitar reservas que terminen otro día
    IF v_local_start::DATE <> v_local_end::DATE THEN
        RAISE EXCEPTION 'El servicio supera el horario del estudio';
    END IF;

    -- Obtener el día de la semana
    v_weekday := EXTRACT(DOW FROM v_local_start)::INTEGER;

    SELECT opens_at, closes_at, is_closed
    INTO v_opens_at, v_closes_at, v_is_closed
    FROM public.business_hours
    WHERE weekday = v_weekday;

    IF NOT FOUND OR v_is_closed THEN
        RAISE EXCEPTION 'El estudio está cerrado ese día.';
    END IF;

    -- Comprobar horario apertura y cierre
    IF v_local_start::TIME < v_opens_at
       OR v_local_end::TIME > v_closes_at THEN
        RAISE EXCEPTION 'La hora seleccionada está fuera del horario del estudio.';
    END IF;

    -- Comprobar excepciones y cierres especiales
    IF EXISTS (
        SELECT 1
        FROM public.availability_exceptions
        WHERE starts_at < v_ends_at
          AND ends_at > p_starts_at
    ) THEN
        RAISE EXCEPTION 'El estudio no está disponible en ese horario.';
    END IF;

    --Identifica al user registrado, si existe
    v_user_id := auth.uid();

    IF v_user_id IS NOT NULL THEN

        SELECT email
        INTO v_auth_email
        FROM auth.users
        WHERE id = v_user_id;

        IF v_auth_email IS NULL THEN
            RAISE EXCEPTION 'No se pudo verificar tu cuenta.';
        END IF;

    -- Asociar la reserva con su cliente
    INSERT INTO public.customers (
            profile_id,
            full_name,
            email,
            phone
        )
        VALUES (
            v_user_id,
            TRIM(p_full_name),
            v_auth_email,
            TRIM(p_phone)
        )
        ON CONFLICT (profile_id)
        DO UPDATE SET
            full_name = EXCLUDED.full_name,
            email = EXCLUDED.email,
            phone = EXCLUDED.phone,
            updated_at = NOW()
        RETURNING id INTO v_customer_id;

    ELSE

    -- Crear cliente invitado sin cuenta
    IF p_email IS NULL OR TRIM(p_email) = '' THEN
            RAISE EXCEPTION 'Introduce tu correo electrónico.';
        END IF;

        INSERT INTO public.customers (
            profile_id,
            full_name,
            email,
            phone
        )
        VALUES (
            NULL,
            TRIM(p_full_name),
            LOWER(TRIM(p_email)),
            TRIM(p_phone)
        )
        RETURNING id INTO v_customer_id;

    END IF;

    -- Guardar preferencias y observaciones
    v_notes := CONCAT_WS(
        E'\n',
        NULLIF(TRIM(p_notes), ''),
        'Forma de uña: ' || COALESCE(p_nail_shape, 'No especificada'),
        CASE
            WHEN p_needs_removal THEN 'Necesita retirada de material.'
            ELSE 'No necesita retirada de material.'
        END
    );

    -- Crear reserva pendiente de pago
    INSERT INTO public.appointments (
        customer_id,
        service_id,
        starts_at,
        ends_at,
        status,
        service_name_snapshot,
        price_snapshot,
        deposit_required,
        notes,
        expires_at
    )
    VALUES (
        v_customer_id,
        p_service_id,
        p_starts_at,
        v_ends_at,
        'pending_payment',
        v_service.name,
        v_price,
        v_deposit,
        v_notes,
        NOW() + INTERVAL '15 minutes'
    )
    RETURNING id INTO v_appointment_id;

    -- Registro del anticipo pendiente en Stripe
    INSERT INTO public.payments (
        appointment_id,
        amount,
        currency,
        payment_type,
        status,
        provider
    )
    VALUES (
        v_appointment_id,
        v_deposit,
        'EUR',
        'deposit',
        'pending',
        'stripe'
    )
    RETURNING id INTO v_payment_id;

    RETURN JSONB_BUILD_OBJECT(
        'success', TRUE,
        'appointment_id', v_appointment_id,
        'payment_id', v_payment_id,
        'service_name', v_service.name,
        'total_price', v_price,
        'duration_minutes', v_duration,
        'deposit_amount', v_deposit,
        'expires_at', NOW() + INTERVAL '15 minutes',
        'status', 'pending_payment'
    );

EXCEPTION
    WHEN exclusion_violation THEN
        RAISE EXCEPTION 'Ese horario acaba de ser reservado. Selecciona otro.';
END;
$$;

REVOKE ALL ON FUNCTION public.create_appointment_booking(
    UUID, TIMESTAMPTZ, TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN
) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.create_appointment_booking(
    UUID, TIMESTAMPTZ, TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN
) TO anon, authenticated;