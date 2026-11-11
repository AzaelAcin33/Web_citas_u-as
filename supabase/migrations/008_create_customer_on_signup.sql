-- Crear auto un cliente cuando se crea su perfil

CREATE OR REPLACE FUNCTION public.handle_new_customer()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.customers (
        profile_id,
        full_name,
        email
    )
    SELECT
        NEW.id,
        NEW.full_name,
        auth_user.email
    FROM auth.users AS auth_user
    WHERE auth_user.id = NEW.id
    ON CONFLICT (profile_id) DO NOTHING;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_created_customer ON public.profiles;

CREATE TRIGGER on_profile_created_customer
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_customer();