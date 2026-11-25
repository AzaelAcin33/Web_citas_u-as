import { emailLayout } from "./layout";

export type PaymentEmailStatus =
    | "received"
    | "failed"
    | "refunded"
    | "deposit_reminder"
    | "receipt";

interface PaymentEmailData {
    customerName: string;
    amount: string;
    concept: string;
    paymentDate?: string;
    paymentMethod?: string;
    bookingUrl?: string;
    transactionId?: string;
}

const PAYMENT_MESSAGES: Record<
    PaymentEmailStatus,
    { subject: string; title: string; message: string }
> = {
    received: {
        subject: "Hemos recibido tu pago",
        title: "Pago recibido",
        message: "Tu pago se ha procesado correctamente. Muchas gracias.",
    },
    failed: {
        subject: "No se ha podido procesar tu pago",
        title: "Pago rechazado",
        message: "No hemos podido completar el pago. Puedes intentarlo de nuevo.",
    },
    refunded: {
        subject: "Tu reembolso ha sido realizado",
        title: "Reembolso realizado",
        message: "Hemos procesado la devolución del importe indicado.",
    },
    deposit_reminder: {
        subject: "Recuerda completar el anticipo de tu reserva",
        title: "Anticipo pendiente",
        message: "Te recordamos que todavía tienes pendiente el anticipo de tu reserva",
    },
    receipt: {
        subject: "Justificante de pago",
        title: "Detalle de tu pago",
        message: "Te enviamos los datos correspondientes a tu operación.",
    },
};

export function paymentEmail(
    status: PaymentEmailStatus,
    data: PaymentEmailData
) {
    const config = PAYMENT_MESSAGES[status];

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
          <strong>Concepto:</strong> ${data.concept}<br>
          <strong>Importe:</strong> ${data.amount}
          ${data.paymentDate
                    ? `<br><strong>Fecha:</strong> ${data.paymentDate}`
                    : ""
                }
          ${data.paymentMethod
                    ? `<br><strong>Método de pago:</strong> ${data.paymentMethod}`
                    : ""
                }
          ${data.transactionId
                    ? `<br><strong>Referencia:</strong> ${data.transactionId}`
                    : ""
                }
        </div>

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