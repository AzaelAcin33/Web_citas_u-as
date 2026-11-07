-- Es el bucket donde guardamos las imagenes del negocio

INSERT INTO storage.buckets (
    id, name, public, file_size_limit, allowed_mime_types
)
VALUES (
    'business-media',
    'business-media',
    TRUE,
    10485760,
    ARRAY[
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/avif'
    ]
)

ON CONFLICT (id) DO UPDATE
SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Limite por archivo es 10 MB