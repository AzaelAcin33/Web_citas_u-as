CREATE OR REPLACE FUNCTION public.cancel_expired_appointments()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_cancelled_count integer;
BEGIN
  UPDATE public.appointments
  SET status = 'cancelled'
  WHERE status = 'pending_payment'
    AND expires_at IS NOT NULL
    AND expires_at <= NOW();

  GET DIAGNOSTICS v_cancelled_count = ROW_COUNT;

  RETURN v_cancelled_count;
END;
$$;