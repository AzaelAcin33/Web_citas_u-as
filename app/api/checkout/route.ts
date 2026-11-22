import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const {
            serviceId,
            startsAt,
            fullName,
            email,
            phone,
            notes,
            nailShape,
            needsRemoval,
        } = body;

        if (!serviceId || !startsAt || !fullName || !email || !phone) {
            return NextResponse.json(
                { error: "Faltan datos para realizar la reserva." },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        const { data: booking, error: bookingError } =
            await supabase.rpc("create_appointment_booking", {
                p_service_id: serviceId,
                p_starts_at: startsAt,
                p_full_name: fullName,
                p_email: email,
                p_phone: phone,
                p_notes: notes || "",
                p_nail_shape: nailShape || "Almendra de salón",
                p_needs_removal: Boolean(needsRemoval),
            });

        if (bookingError) {
            console.error("Error creando reserva:", bookingError);

            return NextResponse.json(
                { error: bookingError.message },
                { status: 400 }
            );
        }

        if (
            !booking?.success ||
            !booking?.appointment_id ||
            !booking?.payment_id
        ) {
            return NextResponse.json(
                { error: "No se pudo crear la reserva." },
                { status: 400 }
            );
        }

        const appUrl = process.env.NEXT_PUBLIC_APP_URL;

        if (!appUrl) {
            throw new Error("Falta NEXT_PUBLIC_APP_URL en .env.local");
        }
        console.log("Fecha del servidor:", new Date().toISOString());
        console.log("Caducidad Stripe:", new Date(
            (Math.floor(Date.now() / 1000) + 60 * 60) * 1000
        ).toISOString());

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            customer_email: email,
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: `Anticipo de reserva - ${booking.service_name}`,
                        },
                        unit_amount: Math.round(
                            Number(booking.deposit_amount) * 100
                        ),
                    },
                    quantity: 1
                },
            ],
            metadata: {
                appointment_id: booking.appointment_id,
                payment_id: booking.payment_id,
            },
            expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
            success_url: `${appUrl}/reservas?payment=success`,
            cancel_url: `${appUrl}/reservas?payment=cancelled`,
        });
        return NextResponse.json({
            url: session.url,
        });
    } catch (error) {
        console.error("Error iniciando Checkout", error);

        return NextResponse.json(
            { error: "No se pudo iniciar el proceso de pago." },
            { status: 500 }
        );
    }
}