import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: NextRequest) {
    try {
        const sessionId = request.nextUrl.searchParams.get("session_id");

        if (!sessionId) {
            return NextResponse.json(
                { error: "Falta el identificador de pago." },
                { status: 400 }
            );
        }

        // Recuperar la sesión de Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== "paid") {
            return NextResponse.json({
                success: false,
                status: session.payment_status,
                message: "El pago todavía no está confirmado."
            });
        }

        const appointmentId = session.metadata?.appointment_id;
        const paymentId = session.metadata?.payment_id;

        if (
            !appointmentId ||
            !paymentId ||
            session.amount_total === null ||
            !session.currency
        ) {
            return NextResponse.json(
                { error: "Los datos del pago están incompletos." },
                { status: 400 }
            );
        }

        // Comprobar que el pago pertenece a esta reserva
        const { data: payment, error: paymentError } = await supabaseAdmin
            .from("payments")
            .select("id, appointment_id, amount, currency, status, provider_reference")
            .eq("id", paymentId)
            .maybeSingle();

        console.log("VERIFICACIÓN STRIPE:", {
            appointmentId,
            paymentId,
            paymentEncontrado: payment,
            errorConsulta: paymentError,
        });
        if (paymentError || !payment || payment.appointment_id !== appointmentId) {
            return NextResponse.json(
                { error: "No se ha encontrado el pago asociado a la reserva." },
                { status: 404 }
            );
        }

        // Comprobar si el webhook ya confirmó el pago
        const alreadyConfirmed =
            payment.status === "approved" &&
            payment.provider_reference === session.id;

        if (!alreadyConfirmed) {
            const { error: confirmError } = await supabaseAdmin.rpc(
                "confirm_stripe_appointment_payment",
                {
                    p_payment_id: paymentId,
                    p_appointment_id: appointmentId,
                    p_session_id: session.id,
                    p_amount_cents: session.amount_total,
                    p_currency: session.currency,
                }
            );

            if (confirmError) {
                console.error("Error confirmando el pago:", confirmError);

                // Comprobar si el webhook lo confirmó mientras tanto
                const { data: updatedPayment } = await supabaseAdmin
                    .from("payments")
                    .select("status, provider_reference")
                    .eq("id", paymentId)
                    .maybeSingle();

                if (
                    updatedPayment?.status !== "approved" ||
                    updatedPayment?.provider_reference !== session.id
                ) {
                    return NextResponse.json(
                        { error: "No se pudo confirmar la reserva." },
                        { status: 409 }
                    );
                }
            }
        }

        // Recuperar los datos de la reserva
        const { data: appointment, error: appointmentError } = await supabaseAdmin
            .from("appointments")
            .select(`
                id,
                starts_at,
                ends_at,
                status,
                service_name_snapshot,
                price_snapshot,
                deposit_required,
                customer_id
            `)
            .eq("id", appointmentId)
            .maybeSingle();

        if (appointmentError || !appointment) {
            return NextResponse.json(
                { error: "No se han podido recuperar los datos de la reserva." },
                { status: 404 }
            );
        }

        // Recuperar los datos del cliente
        const { data: customer, error: customerError } = await supabaseAdmin
            .from("customers")
            .select("full_name, email, phone")
            .eq("id", appointment.customer_id)
            .maybeSingle();

        if (customerError) {
            console.error("Error recuperando el cliente:", customerError);
        }

        return NextResponse.json({
            success: true,
            confirmed: true,
            appointment: {
                id: appointment.id,
                startsAt: appointment.starts_at,
                endsAt: appointment.ends_at,
                status: appointment.status,
                serviceName: appointment.service_name_snapshot,
                totalPrice: appointment.price_snapshot,
                depositAmount: appointment.deposit_required,
                remainingAmount:
                    Number(appointment.price_snapshot) -
                    Number(appointment.deposit_required),
                customerName: customer?.full_name ?? "",
                customerEmail: customer?.email ?? "",
                customerPhone: customer?.phone ?? ""
            },
            payment: {
                id: paymentId,
                amount: payment.amount,
                currency: payment.currency,
                status: "approved"
            }
        });

    } catch (error) {
        console.error("Error verificando sesión de Stripe:", error);

        return NextResponse.json(
            { error: "No se pudo verificar el pago." },
            { status: 500 }
        );
    }
}