-- Añadir fecha caducidad a las reservas
ALTER TABLE public.appointments
ADD COLUMN expires_at TIMESTAMPTZ;

-- Asignar caducidad a las reservas pendientes que ya hay
UPDATE public.appointments
SET expires_at = created_at + INTERVAL '15 minutes'
WHERE status = 'pending_payment'
    AND expires_at IS NULL;

-- Cancelar reservas pendientes que ya hayan cancelado
UPDATE public.appointments
SET status = 'cancelled'
WHERE status = 'pending_payment'
    AND expires_at <= NOW();

-- FUncion para cancelar reservas pendientes caducadas
CREATE OR REPLACE FUNCTION public.cancel_expired_appointments()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    cancelled_count INTEGER;
BEGIN
    UPDATE public.appointments
    SET status = 'cancelled'
    WHERE status = 'pending_payment'
        AND expires_at IS NOT NULL
        AND expires_at <= NOW();

    GET DIAGNOSTICS cancelled_count = ROW_COUNT;
    RETURN cancelled_count;
END;
$$;

-- Permitir ejecutar la fun desde la app

REVOKE ALL ON FUNCTION public.cancel_expired_appointments() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.cancel_expired_appointments()
TO anon, authenticated;