-- Los clientes solo leen sus propios datos; admin/superadmin gestionan el negocio.
-- Reservas, inscripciones y pagos se escribiran desde el servidor seguro.

CREATE OR REPLACE FUNCTION public.has_business_role(required_roles TEXT[])
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles ur
        WHERE ur.user_id = (SELECT auth.uid())
            AND ur.role = ANY(required_roles)
    );
$$;

REVOKE ALL ON FUNCTION public.has_business_role(TEXT[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_business_role(TEXT[]) TO authenticated;

-- Perfiles

CREATE POLICY profiles_select_own_or_admin ON public.profiles
FOR SELECT TO authenticated
USING (id = (SELECT auth.uid()) OR
public.has_business_role(ARRAY['admin','superadmin']));
CREATE POLICY profiles_update_own ON public.profiles
FOR UPDATE TO authenticated
USING (id = (SELECT auth.uid()))
WITH CHECK (id = (SELECT auth.uid()));

-- Solo lectura propia o admin nunca escritura del cliente

CREATE POLICY user_roles_select_own_or_admin ON public.user_roles
FOR SELECT TO authenticated
USING (user_id = (SELECT auth.uid()) OR 
public.has_business_role(ARRAY['admin','superadmin']));

-- Configuracion y contenido público

CREATE POLICY business_settings_public_read ON public.business_settings
FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY business_settings_admin_all ON public.business_settings
FOR ALL TO authenticated
USING (public.has_business_role(ARRAY['admin','superadmin']))
WITH CHECK (public.has_business_role(ARRAY['admin','superadmin']))

CREATE POLICY service_categories_public_read ON public.service_categories
FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY service_categories_admin_all ON public.service_categories
FOR ALL TO authenticated
USING (public.has_business_role(ARRAY['admin','superadmin']))
WITH CHECK (public.has_business_role(ARRAY['admin','superadmin']));

CREATE POLICY services_public_read ON public.services
FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY services_admin_all ON public.services
FOR ALL TO authenticated
USING (public.has_business_role(ARRAY['admin','superadmin']))
WITH CHECK (public.has_business_role(ARRAY['admin','superadmin']));

CREATE POLICY course_categories_public_read ON public.course_categories
FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY course_categories_admin_all ON public.course_categories
FOR ALL TO authenticated
USING (public.has_business_role(ARRAY['admin','superadmin']))
WITH CHECK (public.has_business_role(ARRAY['admin','superadmin']));

CREATE POLICY courses_public_read ON public.courses
FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY courses_admin_all ON public.courses
FOR ALL TO authenticated
USING (public.has_business_role(ARRAY['admin','superadmin']))
WITH CHECK (public.has_business_role(ARRAY['admin','superadmin']));

CREATE POLICY course_sessions_public_read ON public.course_sessions
FOR SELECT TO anon, authenticated
USING (
    status IN ('open','full')
    AND EXISTS (
        SELECT 1 FROM public.courses c
        WHERE c.id = course_sessions.course_id AND c.is_active = true
    )
);
CREATE POLICY course_sessions_admin_all ON public.course_sessions
FOR ALL TO authenticated
USING (public.has_business_role(ARRAY['admin','superadmin']))
WITH CHECK (public.has_business_role(ARRAY['admin','superadmin']));

CREATE POLICY business_hours_public_read ON public.business_hours
FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY business_hours_admin_all ON public.business_hours
FOR ALL TO authenticated
USING (public.has_business_role(ARRAY['admin','superadmin']))
WITH CHECK (public.has_business_role(ARRAY['admin','superadmin']));

-- Clientes

CREATE POLICY customers_select_own_or_admin ON public.customers
FOR SELECT TO authenticated
USING (profile_id = (SELECT auth.uid()) OR public.has_business_role(ARRAY['admin','superadmin']));
CREATE POLICY customers_admin_insert ON public.customers
FOR INSERT TO authenticated
WITH CHECK (public.has_business_role(ARRAY['admin','superadmin']));
CREATE POLICY customers_admin_update ON public.customers
FOR UPDATE TO authenticated
USING (public.has_business_role(ARRAY['admin','superadmin']))
WITH CHECK (public.has_business_role(ARRAY['admin','superadmin']));
CREATE POLICY customers_admin_delete ON public.customers
FOR DELETE TO authenticated
USING (public.has_business_role(ARRAY['admin','superadmin']));

-- Excepciones de disponibilidad: Solo admins

CREATE POLICY availability_exceptions_admin_all ON
public.availability_exceptions
FOR ALL TO authenticated
USING (public.has_business_role(ARRAY['admin','superadmin']))
WITH CHECK (public.has_business_role(ARRAY['admin','superadmin']));

-- Reservas

CREATE POLICY appointments_select_own_or_admin ON public.appointments
FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.customers c
        WHERE c.id = appointments.customer_id AND c.profile_id = (SELECT auth.uid())
    )
    OR public.has_business_role(ARRAY['admin','superadmin'])
);
CREATE POLICY appointments_admin_insert ON public.appointments
FOR INSERT TO authenticated
WITH CHECK (public.has_business_role(ARRAY['admin','superadmin']));
CREATE POLICY appointments_admin_update ON public.appointments
FOR UPDATE TO authenticated
USING (public.has_business_role(ARRAY['admin','superadmin']))
WITH CHECK (public.has_business_role(ARRAY['admin','superadmin']));
CREATE POLICY appointments_admin_delete ON public.appointments
FOR DELETE TO authenticated
USING (public.has_business_role(ARRAY['admin','superadmin']));

-- Inscripciones

CREATE POLICY course_enrollments_select_own_or_admin ON public.course_enrollments
FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.customers c
        WHERE c.id = course_enrollments.customer_id AND c.profile_id = (SELECT auth.uid())
    )
    OR public.has_business_role(ARRAY['admin','superadmin'])
);
CREATE POLICY course_enrollments_admin_insert ON public.course_enrollments
FOR INSERT TO authenticated
WITH CHECK (public.has_business_role(ARRAY['admin','superadmin']));
CREATE POLICY course_enrollments_admin_update ON public.course_enrollments
FOR UPDATE TO authenticated
USING (public.has_business_role(ARRAY['admin','superadmin']))
WITH CHECK (public.has_business_role(ARRAY['admin','superadmin']));
CREATE POLICY course_enrollments_admin_delete ON public.course_enrollments
FOR DELETE TO authenticated
USING (public.has_business_role(ARRAY['admin','superadmin']));

-- Pagos

CREATE POLICY payments_select_own_or_admin ON public.payments
FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.appointments a
        JOIN public.customers c ON c.id = a.customer_id
        WHERE a.id = payments.appointment_id AND c.profile_id = (SELECT auth.uid())
    )
    OR EXISTS (
        SELECT 1
        FROM public.course_enrollments ce
        JOIN public.customers c ON c.id = ce.customer_id
        WHERE ce.id = payments.enrollment_id AND c.profile_id = (SELECT auth.uid())
    )
    OR public.has_business_role(ARRAY['admin','superadmin'])
);
CREATE POLICY payments_admin_insert ON public.payments
FOR INSERT TO authenticated
WITH CHECK (public.has_business_role(ARRAY['admin','superadmin']));
CREATE POLICY payments_admin_update ON public.payments
FOR UPDATE TO authenticated
USING (public.has_business_role(ARRAY['admin','superadmin']))
WITH CHECK (public.has_business_role(ARRAY['admin','superadmin']));
CREATE POLICY payments_admin_delete ON public.payments
FOR DELETE TO authenticated
USING (public.has_business_role(ARRAY['admin','superadmin']));

-- Galeria

CREATE POLICY gallery_items_public_read ON public.gallery_items
FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY gallery_items_admin_all ON public.gallery_items
FOR ALL TO authenticated
USING (public.has_business_role(ARRAY['admin','superadmin']))
WITH CHECK (public.has_business_role(ARRAY['admin','superadmin']));

CREATE POLICY media_public_read_published ON public.media
FOR SELECT TO anon, authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.gallery_items gi
        WHERE gi.media_id = media.id AND gi.is_published = true
    )
);
CREATE POLICY media_admin_all ON public.media
FOR ALL TO authenticated
USING (public.has_business_role(ARRAY['admin','superadmin']))
WITH CHECK (public.has_business_role(ARRAY['admin','superadmin']));