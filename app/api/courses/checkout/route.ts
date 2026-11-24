import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
    let enrollmentId: string | null = null;
    let paymentId: string | null = null;

    try {
        const body = await request.json();

        const { sessionId, fullName, email, phone, } = body;

        if (
            !sessionId ||
            !fullName?.trim() ||
            !email?.trim() ||
            !phone?.trim()
        ) {
            return NextResponse.json(
                { error: "Completa todos los datos de inscripción" },
                { status: 400 }
            );
        }

        const { data: enrollment, error: enrollmentError } =
            await supabaseAdmin.rpc("create_course_enrollment", {
                p_session_id: sessionId,
                p_full_name: fullName,
                p_email: email,
                p_phone: phone,
            });

        if (enrollmentError || !enrollment?.success) {
            console.error("ERROR CREANDO INSCRIPCIÓN:", enrollmentError);

            return NextResponse.json(
                {
                    error:
                        enrollmentError?.message ||
                        enrollment?.message ||
                        "No se pudo preparar la inscripción.",
                },
                { status: 400 }
            );
        }
        enrollmentId = enrollment.enrollment_id;
        paymentId = enrollment.payment_id;

        const appUrl = process.env.NEXT_PUBLIC_APP_URL;

        if (!appUrl) {
            throw new Error("Falta NEXT_PUBLIC_APP_URL.")
        }

        const expirationTime = Math.floor(Date.now() / 1000) + 30 * 60;

        const checkoutSession = await stripe.checkout.sessions.create({
            mode: "payment",
            customer_email: email.trim(),
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: `Curso de uñas - ${enrollment.course_name}`,
                        },
                        unit_amount: Math.round(Number(enrollment.amount) * 100),
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                payment_type: "course",
                enrollment_id: enrollmentId,
                payment_id: paymentId,
            },
            expires_at: expirationTime,
            success_url: `${appUrl}/cursos?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${appUrl}/cursos?payment=cancelled`,
        });

        console.log("STRIPE CHECKOUT CREADO:", checkoutSession.id);
        console.log("STRIPE CHECKOUT URL:", checkoutSession.url);

        const { error: updateError } = await supabaseAdmin
            .from("payments")
            .update({
                provider_reference: checkoutSession.id,
            })
            .eq("id", paymentId);

        if (updateError) {
            console.error("ERROR GUARDANDO REFERENCIA STRIPE:", updateError);
            throw updateError;
        }

        console.log("REFERENCIA STRIPE GUARDADA:", checkoutSession.id);
        return NextResponse.json({
            url: checkoutSession.url,
        });
    } catch (error) {
        console.error("Error iniciando inscripción de curso:", error);

        // No eliminar la inscripción ni liberar la plaza automáticamente:
        // se revisará el estado del pago para evitar inconsistencias.

        return NextResponse.json(
            { error: "No se pudo iniciar el pago del curso." },
            { status: 500 }
        );
    }
}