import { emailLayout } from "./layout";

export type BookingEmailStatus =
    | "requested"
    | "confirmed"
    | "deposit_received"
    | "cancelled_customer"
    | "rescheduled"
    | "reminder_24h"
    | "review"
    | "no_show"

interface BookingEmailData {
    customerName: string;
    serviceName: string;
    date: string;
    time: string;
    deposit?: string;
    bookingUrl?: string;
    businessMessage?: string;
}

const BOOKING_MESSAGES: Record<
    BookingEmailStatus,
    { subject: string; title: string; message: string }
> = {
    requested: {
        subject: "Hemos recibido tu solicitud de reserva",
        title: "Solicitud recibida",
        message: "Hemos recibido tu solicitud de cita. Te informaremos cuando quede confirmada."
    },
    confirmed: {
        subject: "Tu cita está confirmada",
        title: "Cita confirmada",
        message: "Tu reserva se ha confirmado correctamente. ¡Estamos deseando verte!",
    },
    deposit_received: {
        subject: "Hemos recibido tu anticipo",
        title: "Anticipo recibido",
        message: "Tu anticipo se ha recibido correctamente. Tu reserva está confirmada.",
    },
    cancelled_customer: {
        subject: "Tu cita a sido cancelada",
        title: "Reserva cancelada",
        message: "Hemos registrado la cancelación de tu cita",
    },
    rescheduled: {
        subject: "Tu cita ha cambiado de horario",
        title: "Reserva modificada",
        message: "Los datos de tu cita se han actualizado. Consulta a continuación la nueva información.",
    },
    reminder_24h: {
        subject: "Mañana tienes una cita con nosotros",
        title: "¡Mañana nos vemos!",
        message: "Te recordamos que mañana tienes una cita en L'Atelier Nails.",
    },
    review: {
        subject: "¿Qué te ha parecido tu experiencia?",
        title: "Nos importa tu opinión",
        message: "Nos encantaría conocer tu opinión sobre el servicio recibido.",
    },
    no_show: {
        subject: "Información sobre tu cita",
        title: "No hemos podido atenderte",
        message: "Hemos registrado que no has podido acudir a tu cita. Si necesitas una nueva reserva, estaremos encantados de ayudarte.",
    },
};

export function bookingEmail(
    status: BookingEmailStatus,
    data: BookingEmailData
) {
    const config = BOOKING_MESSAGES[status];

    return {
        subject: config.subject + " | L'Atelier Nails",

        html: emailLayout({
            title: config.title,
            preview: config.message,

            content: `
        <h2 style="font-family:Georgia,serif;font-weight:400;">
          ${config.title}
        </h2>

        <p>Hola ${data.customerName},</p>

        <p>${config.message}</p>

        <div style="background:#F1EDE4;padding:20px;border-radius:12px;line-height:1.9;margin:25px 0;">
          <strong>Servicio:</strong> ${data.serviceName}<br>
          <strong>Fecha:</strong> ${data.date}<br>
          <strong>Hora:</strong> ${data.time}
          ${data.deposit
                    ? `<br><strong>Anticipo:</strong> ${data.deposit}`
                    : ""
                }
        </div>

        ${data.businessMessage
                    ? `<p>${data.businessMessage}</p>`
                    : ""
                }

        ${data.bookingUrl
                    ? `
              <div style="text-align:center;margin:30px 0;">
                <a href="${data.bookingUrl}"
                  style="display:inline-block;padding:14px 28px;background:#2D2C28;color:#FFFFFF;text-decoration:none;border-radius:8px;">
                  Consultar mi reserva
                </a>
              </div>
            `
                    : ""
                }

        <p>Gracias por confiar en L'Atelier Nails.</p>
      `,
        }),
    };
}