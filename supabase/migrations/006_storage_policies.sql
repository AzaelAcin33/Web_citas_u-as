-- Lectura publica de imagenes del negocio

DROP POLICY IF EXISTS business_media_public_read ON storage.objects;
CREATE POLICY business_media_public_read
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'business-media');

-- Subida de imagenes

DROP POLICY IF EXISTS business_media_admin_insert ON storage.objects;
CREATE POLICY business_media_admin_insert
ON storage.objects
FOR business_media_admin_insert
TO authenticated
WITH CHECK (
    bucket_id = 'business-media'
    AND public.has_business_role(ARRAY['admin', 'superadmin'])
);

-- Modificacion o sustitucion de imagenes

DROP POLICY IF EXISTS business_media_admin_update ON storage.objects;
CREATE POLICY business_media_admin_update
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'business-media'
    AND public.has_business_role(ARRAY['admin', 'superadmin'])
)
WITH CHECK (
    bucket_id = 'business-media'
    AND public.has_business_role(ARRAY['admin', 'superadmin'])
);

-- Eliminacion de imagenes

DROP POLICY IF EXISTS business_media_admin_delete ON storage.objects;
CREATE POLICY business_media_admin_delete
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'business-media'
    AND public.has_business_role(ARRAY['admin', 'superadmin'])
);