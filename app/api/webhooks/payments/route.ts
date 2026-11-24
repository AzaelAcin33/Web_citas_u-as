import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Falta la firma o el secreto del webhook." },
      { status: 400 }
    );
  }

  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error("Firma Stripe inválida:", error);

    return NextResponse.json(
      { error: "Firma de Stripe no válida." },
      { status: 400 }
    );
  }

  if (
    event.type === "checkout.session.expired" ||
    event.type === "checkout.session.async_payment_failed"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.metadata?.payment_type === "course") {
      const { enrollment_id, payment_id } = session.metadata;

      if (!enrollment_id || !payment_id) {
        return NextResponse.json(
          { error: "Faltan datos de la inscripción." },
          { status: 400 }
        );
      }

      const { data, error } = await supabaseAdmin.rpc(
        "expire_stripe_course_payment",
        {
          p_payment_id: payment_id,
          p_enrollment_id: enrollment_id,
          p_session_id: session.id,
        }
      );

      if (error || data !== true) {
        console.error("Error liberando plaza:", error);

        return NextResponse.json(
          { error: "No se pudo liberar la plaza." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ received: true });
  }

  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.async_payment_succeeded"
  ) {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (session.payment_status !== "paid") {
    return NextResponse.json({ received: true });
  }

  // PAGOS DE CURSOS
  if (session.metadata?.payment_type === "course") {
    const enrollmentId = session.metadata.enrollment_id;
    const paymentId = session.metadata.payment_id;

    if (
      !enrollmentId ||
      !paymentId ||
      !session.amount_total ||
      !session.currency
    ) {
      console.error("Faltan datos del pago del curso:", session.id);

      return NextResponse.json(
        { error: "Faltan datos para confirmar el curso." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin.rpc(
      "confirm_stripe_course_payment",
      {
        p_payment_id: paymentId,
        p_enrollment_id: enrollmentId,
        p_session_id: session.id,
        p_amount_cents: session.amount_total,
        p_currency: session.currency,
      }
    );

    if (error || data !== true) {
      console.error("Error confirmando pago del curso:", error);

      return NextResponse.json(
        { error: "No se pudo confirmar la inscripción." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      received: true,
      confirmed: true,
      type: "course",
    });
  }

  // PAGOS DE CITAS: mantener el funcionamiento existente
  const appointmentId = session.metadata?.appointment_id;
  const paymentId = session.metadata?.payment_id;

  if (
    !appointmentId ||
    !paymentId ||
    !session.amount_total ||
    !session.currency
  ) {
    console.error("Faltan datos en la sesión:", session.id);

    return NextResponse.json(
      { error: "La sesión no contiene los datos necesarios." },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin.rpc(
    "confirm_stripe_appointment_payment",
    {
      p_payment_id: paymentId,
      p_appointment_id: appointmentId,
      p_session_id: session.id,
      p_amount_cents: session.amount_total,
      p_currency: session.currency,
    }
  );

  if (error || data !== true) {
    console.error("Error confirmando el pago de la cita:", error);

    return NextResponse.json(
      { error: "No se pudo confirmar el pago en Supabase." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    received: true,
    confirmed: true,
    type: "appointment",
  });
}