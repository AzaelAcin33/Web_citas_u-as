CREATE OR REPLACE FUNCTION public.cancel_expired_appointments()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    cancelled_count INTEGER;
BEGIN

    -- Marcar como fallidos los pagos pendientes
    UPDATE public.payments
    SET status = 'failed'
    WHERE status = 'pending'
      AND appointment_id IN (
          SELECT id
          FROM public.appointments
          WHERE status = 'pending_payment'
            AND expires_at IS NOT NULL
            AND expires_at <= NOW()
      );

    -- Cancelar las reservas caducadas
    UPDATE public.appointments
    SET status = 'cancelled'
    WHERE status = 'pending_payment'
      AND expires_at IS NOT NULL
      AND expires_at <= NOW();

    GET DIAGNOSTICS cancelled_count = ROW_COUNT;

    RETURN cancelled_count;
END;
$$;

REVOKE ALL ON FUNCTION public.cancel_expired_appointments()
FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.cancel_expired_appointments()
TO anon, authenticated;


-- Activar pg_cron si está disponible
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;


-- Programar la limpieza cada minuto
DO $$
BEGIN

    IF EXISTS (
        SELECT 1
        FROM cron.job
        WHERE jobname = 'cancel-expired-appointments'
    ) THEN
        PERFORM cron.unschedule(jobid)
        FROM cron.job
        WHERE jobname = 'cancel-expired-appointments';
    END IF;

    PERFORM cron.schedule(
        'cancel-expired-appointments',
        '* * * * *',
        'SELECT public.cancel_expired_appointments();'
    );

END;
$$;