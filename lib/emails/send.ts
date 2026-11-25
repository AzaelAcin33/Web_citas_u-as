import { resend, EMAIL_FROM } from "./resend"

interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
}

export async function snedEmail({
    to,
    subject,
    html,
}: SendEmailParams) {
    if (!to || !subject || !html) {
        throw new Error("Faltan datos para enviar el correo.");
    }

    const { data, error } = await resend.emails.send({
        from: EMAIL_FROM,
        to: [to],
        subject,
        html,
    });

    if (error) {
        console.error("Error enviando correo:", error);
        throw new Error("No se pudo enviar el correo.");
    }

    return data;
}