-- Indices para consultar los pagos de reservas
CREATE INDEX IF NOT EXISTS idx_payments_appointment_id
ON public.payments (appointment_id);

CREATE INDEX IF NOT EXISTS idx_payments_status
ON public.payments (status);

-- Evitar referencias duplicadas de Stripe
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_provider_reference_unique
ON public.payments (provider, provider_reference)
WHERE provider_reference IS NOT NULL;

-- Facilitr la búsqueda de reservas pendientes
CREATE INDEX IF NOT EXISTS idx_payments_pending_expiration
ON public.appointments (expires_at)
WHERE status = 'pending_payment';

-- Facilitar la consulta de reservas por cliente
CREATE INDEX IF NOT EXISTS idx_appointments_customer_starts
ON public.appointments (customer_id, starts_at);