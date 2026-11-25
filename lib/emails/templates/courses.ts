import { emailLayout } from "./layout";

export type CourseEmailStatus =
    | "enrollment_received"
    | "enrollment_confirmed"
    | "payment_received"
    | "payment_failed"
    | "course_reminder"
    | "schedule_changed"
    | "course_cancelled"
    | "course_completed"
    | "certificate_available";

interface CourseEmailData {
    customerName: string;
    courseName: string;
    courseDate?: string;
    courseTime?: string;
    amount?: string;
    location?: string;
    certificateUrl?: string;
    courseUrl?: string;
    businessMessage?: string;
}

const COURSE_MESSAGES: Record<
    CourseEmailStatus,
    { subject: string; title: string; message: string }
> = {
    enrollment_received: {
        subject: "Hemos recibido tu inscripción",
        title: "Inscripción recibida",
        message: "Hemos recibido tu solicitud de inscripción. Te informaremos cuando quede confirmada.",
    },
    enrollment_confirmed: {
        subject: "Tu inscripción está confirmada",
        title: "¡Plaza confirmada!",
        message: "Tu inscripción se ha confirmado correctamente. ¡Estamos deseando compartir esta formación contigo!",
    },
    payment_received: {
        subject: "Hemos recibido el pago de tu curso",
        title: "Pago recibido",
        message: "El pago de tu formación se ha procesado correctamente.",
    },
    payment_failed: {
        subject: "No se ha podido procesar el pago",
        title: "Pago rechazado",
        message: "No hemos podido completar el pago de tu formación. Puedes intentarlo de nuevo.",
    },
    course_reminder: {
        subject: "Tu formación está a punto de comenzar",
        title: "¡Tu curso se acerca!",
        message: "Te recordamos que pronto comienza tu formación en L'Atelier Nails.",
    },
    schedule_changed: {
        subject: "Actualización de tu formación",
        title: "Cambio de convocatoria",
        message: "La fecha u horario de tu formación ha cambiado. Consulta los nuevos datos a continuación.",
    },
    course_cancelled: {
        subject: "Tu formación ha sido cancelada",
        title: "Curso cancelado",
        message: "Lamentamos comunicarte que esta formación ha tenido que ser cancelada.",
    },
    course_completed: {
        subject: "Has finalizado tu formación",
        title: "¡Enhorabuena!",
        message: "Has completado tu formación. Esperamos que hayas disfrutado de la experiencia y aprendido mucho.",
    },
    certificate_available: {
        subject: "Tu certificado está disponible",
        title: "¡Tu certificado te espera!",
        message: "Ya puedes consultar y descargar tu certificado de formación.",
    },
};

export function courseEmail(
    status: CourseEmailStatus,
    data: CourseEmailData
) {
    const config = COURSE_MESSAGES[status];

    return {
        subject: `${config.subject} | L'Atelier Nails`,

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
          <strong>Formación:</strong> ${data.courseName}
          ${data.courseDate
                    ? `<br><strong>Fecha:</strong> ${data.courseDate}`
                    : ""
                }
          ${data.courseTime
                    ? `<br><strong>Horario:</strong> ${data.courseTime}`
                    : ""
                }
          ${data.location
                    ? `<br><strong>Ubicación:</strong> ${data.location}`
                    : ""
                }
          ${data.amount
                    ? `<br><strong>Importe:</strong> ${data.amount}`
                    : ""
                }
        </div>

        ${data.businessMessage
                    ? `<p>${data.businessMessage}</p>`
                    : ""
                }

        ${data.certificateUrl
                    ? `
              <div style="text-align:center;margin:30px 0;">
                <a href="${data.certificateUrl}"
                  style="display:inline-block;padding:14px 28px;background:#2D2C28;color:#FFFFFF;text-decoration:none;border-radius:8px;">
                  Descargar certificado
                </a>
              </div>
            `
                    : ""
                }

        ${data.courseUrl
                    ? `
              <div style="text-align:center;margin:30px 0;">
                <a href="${data.courseUrl}"
                  style="display:inline-block;padding:14px 28px;background:#2D2C28;color:#FFFFFF;text-decoration:none;border-radius:8px;">
                  Consultar formación
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