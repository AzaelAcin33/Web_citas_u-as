CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Evitar las coincidencias de horario
ALTER TABLE public.appointments
ADD CONSTRAINT appointments_no_overlapping_active
EXCLUDE USING gist (
    tstzrange(starts_at, ends_at, '[)') WITH &&
)
WHERE (status <> 'cancelled');
