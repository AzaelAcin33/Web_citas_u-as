import { supabaseAdmin } from "../supabase-admin";
import { sendEmail } from "../email";

interface NotificationParams {
    key: string;
    to: string;
    type: string;
    subject: string;
    html: string;
}

export async function sendNotification({
    key, to, type, subject, html,
}: NotificationParams) {
    if (!key || !to || !type || !subject || !html) {
        throw new Error("Faltan datos");
    }

    const { data: inserted, error: insertError } =
        await supabaseAdmin
            .from("email_notifications")
            .insert({
                notification_key: key,
                recipient_email: to,
                notification_type: type,
                status: "pending",
            })
            .select("id")
            .maybeSingle();

    let notificationId = inserted?.id;

    if (insertError) {
        if (insertError.code !== "23505") {
            throw insertError;
        }

        const { data: existing, error: lookupError } =
            await supabaseAdmin
                .from("email_notifications")
                .select("id, status")
                .eq("notification_key", key)
                .maybeSingle();

        if (lookupError || !existing) {
            throw new Error("No se pudo consultar la notificación.");
        }

        if (existing.status !== "failed") {
            return { sent: false, duplicate: true };
        }

        const { data: retry, error: retryError } =
            await supabaseAdmin
                .from("email_notifications")
                .update({
                    status: "pending",
                    error_message: null,
                })
                .eq("id", existing.id)
                .eq("status", "failed")
                .select("id")
                .maybeSingle();

        if (retryError) throw retryError;

        if (!retry) {
            return { sent: false, duplicate: true };
        }

        notificationId = retry.id;
    }

    if (!notificationId) {
        throw new Error("No se pudo registrar la notificación.");
    }

    try {
        const result = await sendEmail({
            to,
            subject,
            html,
        });

        const { error: updateError } = await supabaseAdmin
            .from("email_notifications")
            .update({
                status: "sent",
                provider_message_id: result?.id ?? null,
                sent_at: new Date().toISOString(),
                error_message: null,
            })
            .eq("id", notificationId);

        if (updateError) {
            console.error("No se pudo actualizar la notificación:", updateError);
        }

        return { sent: true, duplicate: false };
    } catch (error) {
        await supabaseAdmin
            .from("email_notifications")
            .update({
                status: "failed",
                error_message:
                    error instanceof Error
                        ? error.message
                        : "Error desconocido",
            })
            .eq("id", notificationId);

        throw error;
    }
}