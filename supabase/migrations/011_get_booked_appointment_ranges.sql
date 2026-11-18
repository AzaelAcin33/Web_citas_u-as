CREATE OR REPLACE FUNCTION public.get_booked_appointment_ranges(
    p_start timestamptz,
    p_end timestamptz
)
RETURNS TABLE (
    starts_at timestamptz,
    ends_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT
        a.starts_at,
        a.ends_at
    FROM public.appointments AS a
    WHERE a.status <> 'cancelled'
        AND a.starts_at < p_end
        AND a.ends_at > p_start;
$$;

REVOKE ALL ON FUNCTION public.get_booked_appointment_ranges(timestamptz, timestamptz)
FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.get_booked_appointment_ranges(timestamptz, timestamptz)
TO anon, authenticated;