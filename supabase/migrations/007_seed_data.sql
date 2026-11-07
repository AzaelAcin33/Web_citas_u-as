INSERT INTO public.service_categories (name, description, sort_order, is_active)
SELECT 'Servicios de uñas', 'Categoria inicial para organizar los servicios de uñas.', 1, TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM public.service_categories
    WHERE name = 'Servicios de uñas'
);

INSERT INTO public.course_categories (name, description, sort_order, is_active)
SELECT 'Cursos de uñas', 'Categoria inicial para los cursos relacionados con uñas.', 1, TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM public.course_categories
    WHERE name = 'Cursos de uñas'
);

INSERT INTO public.course_categories (name, description, sort_order, is_active)
SELECT 'Jabones naturales y exfoliación', 'Categoria inicial para cursos de elaboracion de jabones y exfoliantes.', 2, TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM public.course_categories
    WHERE name = 'Jabones naturales y exfoliación'
);