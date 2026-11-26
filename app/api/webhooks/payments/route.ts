import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";

import { sendNotification } from "@/lib/emails/notify";
import { bookingEmail } from "@/lib/emails/templates/booking";
import { courseEmail } from "@/lib/emails/templates/courses";

// Formato de fecha y hora para España.
function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Madrid",
  }).format(new Date(date));
}

function formatTime(date: string) {
  return new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Madrid",
  }).format(new Date(date));
}

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

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

  console.log("STRIPE WEBHOOK RECIBIDO:", {
    eventId: event.id,
    eventType: event.type,
    paymentStatus:
      event.data.object &&
        "payment_status" in event.data.object
        ? event.data.object.payment_status
        : undefined,
  });

  // PAGOS CADUCADOS O FALLIDOS
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

  // IGNORAR EVENTOS QUE NO SEAN CONFIRMACIONES DE PAGO
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

  if (
    !session.amount_total ||
    !session.currency
  ) {
    return NextResponse.json(
      { error: "Faltan datos del importe o la moneda." },
      { status: 400 }
    );
  }

  // ==========================================
  // PAGOS DE CURSOS
  // ==========================================

  if (session.metadata?.payment_type === "course") {
    const enrollmentId = session.metadata.enrollment_id;
    const paymentId = session.metadata.payment_id;

    if (!enrollmentId || !paymentId) {
      return NextResponse.json(
        { error: "Faltan datos del pago del curso." },
        { status: 400 }
      );
    }

    // Confirmar pago en Supabase.
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

    // Recuperar inscripción.
    const { data: enrollment, error: enrollmentError } =
      await supabaseAdmin
        .from("course_enrollments")
        .select("customer_id, course_session_id")
        .eq("id", enrollmentId)
        .maybeSingle();

    if (enrollmentError || !enrollment) {
      console.error("Error recuperando inscripción:", enrollmentError);

      return NextResponse.json(
        { error: "No se pudo recuperar la inscripción." },
        { status: 500 }
      );
    }

    // Recuperar cliente.
    const { data: customer, error: customerError } =
      await supabaseAdmin
        .from("customers")
        .select("full_name, email")
        .eq("id", enrollment.customer_id)
        .maybeSingle();

    if (customerError) {
      console.error("Error recuperando cliente:", customerError);

      return NextResponse.json(
        { error: "No se pudo recuperar el cliente." },
        { status: 500 }
      );
    }

    // Recuperar sesión del curso.
    const { data: courseSession, error: sessionError } =
      await supabaseAdmin
        .from("course_sessions")
        .select("course_id, starts_at, location")
        .eq("id", enrollment.course_session_id)
        .maybeSingle();

    if (sessionError || !courseSession) {
      console.error("Error recuperando sesión:", sessionError);

      return NextResponse.json(
        { error: "No se pudo recuperar la fecha del curso." },
        { status: 500 }
      );
    }

    // Recuperar curso.
    const { data: course, error: courseError } =
      await supabaseAdmin
        .from("courses")
        .select("name")
        .eq("id", courseSession.course_id)
        .maybeSingle();

    if (courseError || !course) {
      console.error("Error recuperando curso:", courseError);

      return NextResponse.json(
        { error: "No se pudo recuperar el curso." },
        { status: 500 }
      );
    }

    // Enviar correo de confirmación.
    if (customer?.email) {
      const email = courseEmail("enrollment_confirmed", {
        customerName: customer.full_name,
        courseName: course.name,
        courseDate: formatDate(courseSession.starts_at),
        courseTime: formatTime(courseSession.starts_at),
        location: courseSession.location ?? undefined,
        amount: formatAmount(
          session.amount_total,
          session.currency
        ),
      });

      await sendNotification({
        key: `course-payment:${paymentId}`,
        to: customer.email,
        type: "course_enrollment_confirmed",
        subject: email.subject,
        html: email.html,
      });
    } else {
      console.warn(
        "Inscripción confirmada, pero el cliente no tiene email:",
        enrollmentId
      );
    }

    return NextResponse.json({
      received: true,
      confirmed: true,
      type: "course",
    });
  }

  // ==========================================
  // PAGOS DE CITAS
  // ==========================================

  const appointmentId = session.metadata?.appointment_id;
  const paymentId = session.metadata?.payment_id;

  if (!appointmentId || !paymentId) {
    return NextResponse.json(
      { error: "Faltan los datos de la reserva." },
      { status: 400 }
    );
  }

  // Confirmar pago en Supabase.
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
    console.error("Error confirmando pago de la cita:", error);

    return NextResponse.json(
      { error: "No se pudo confirmar el pago en Supabase." },
      { status: 500 }
    );
  }

  // Recuperar reserva.
  const { data: appointment, error: appointmentError } =
    await supabaseAdmin
      .from("appointments")
      .select("customer_id, service_name_snapshot, starts_at")
      .eq("id", appointmentId)
      .maybeSingle();

  if (appointmentError || !appointment) {
    console.error("Error recuperando reserva:", appointmentError);

    return NextResponse.json(
      { error: "No se pudo recuperar la reserva." },
      { status: 500 }
    );
  }

  // Recuperar cliente.
  const { data: customer, error: customerError } =
    await supabaseAdmin
      .from("customers")
      .select("full_name, email")
      .eq("id", appointment.customer_id)
      .maybeSingle();

  if (customerError) {
    console.error("Error recuperando cliente:", customerError);

    return NextResponse.json(
      { error: "No se pudo recuperar el cliente." },
      { status: 500 }
    );
  }

  // Enviar correo de confirmación de la reserva.
  if (customer?.email) {
    const email = bookingEmail("deposit_received", {
      customerName: customer.full_name,
      serviceName: appointment.service_name_snapshot,
      date: formatDate(appointment.starts_at),
      time: formatTime(appointment.starts_at),
      deposit: formatAmount(
        session.amount_total,
        session.currency
      ),
    });

    await sendNotification({
      key: `appointment-deposit:${paymentId}`,
      to: customer.email,
      type: "appointment_deposit_received",
      subject: email.subject,
      html: email.html,
    });
  } else {
    console.warn(
      "Reserva confirmada, pero el cliente no tiene email:",
      appointmentId
    );
  }

  return NextResponse.json({
    received: true,
    confirmed: true,
    type: "appointment",
  });
}