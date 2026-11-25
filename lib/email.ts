import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail({
    to,
    subject,
    html,
}: SendEmailParams) {
    if (!process.env.RESEND_API_KEY) {
        throw new Error("Falta configurar RESEND_API_KEY");
    }

    const { data, error } = await resend.emails.send({
        from: "L'Atelier Nails <onboarding@resend.dev>",
        to: [to],
        subject,
        html,
    });

    if (error) {
        console.error("Error enviendo el correo", error);
        throw new Error("No se pudo enviar el correo")
    }
    return data;
}