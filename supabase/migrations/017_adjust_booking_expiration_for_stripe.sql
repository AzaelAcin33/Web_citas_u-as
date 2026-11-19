DO $$
DECLARE
    v_definition TEXT;
    v_old TEXT := 'INTERVAL ''15 minutes''';
    v_new TEXT := 'INTERVAL ''35 minutes''';
    v_occurrences INTEGER;
BEGIN
    SELECT pg_get_functiondef(
        'public.create_appointment_booking(uuid,timestamp with time zone,text,text,text,text,text,boolean)'::regprocedure
    )
    INTO v_definition;

    v_occurrences :=
        (
            LENGTH(v_definition)
            - LENGTH(REPLACE(v_definition, v_old, ''))
        ) / LENGTH(v_old);

    IF v_occurrences <> 2 THEN
        RAISE EXCEPTION
            'Se esperaban 2 referencias a 15 minutos, pero se encontraron %.',
            v_occurrences;
    END IF;

    EXECUTE REPLACE(v_definition, v_old, v_new);
END;
$$;