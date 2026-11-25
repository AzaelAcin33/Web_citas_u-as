import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
    throw new Error("Falat configurar RESEND_API_KEY");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export const EMAIL_FROM =
    "L'Atelier Nails <onboarding@resend.dev>";