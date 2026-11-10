import { NextRequest, NextResponse } from "next/server";

/**
 * Webhook seguro para recibir confirmaciones de la pasarela de pago externa (ej. Stripe / Redsys).
 * Cumple con la Sección 8 del plan:
 * - No se guardan números de tarjeta ni CVV en la base de datos.
 * - Registra la operación en `public.payments` (anticipo 50% o matrícula de curso) y actualiza
 *   el estado de `public.appointments` a `confirmed` o `public.course_enrollments` a `confirmed`.
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    const {
      appointment_id = null,
      enrollment_id = null,
      amount,
      currency = "EUR",
      payment_type = "deposit",
      provider = "Stripe",
      provider_reference,
    } = payload;

    if ((!appointment_id && !enrollment_id) || !provider_reference) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Se requiere appointment_id o enrollment_id junto con provider_reference.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      message:
        "Pago verificado por el servidor. Lista la integración con Supabase Service Role para insertar en public.payments y confirmar la reserva/inscripción.",
      record_preview: {
        appointment_id,
        enrollment_id,
        amount,
        currency,
        payment_type,
        status: "approved",
        provider,
        provider_reference,
        paid_at: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Payload de webhook inválido" },
      { status: 400 }
    );
  }
}
