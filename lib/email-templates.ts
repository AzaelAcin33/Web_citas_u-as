interface BookingEmailData {
  customerName: string;
  serviceName: string;
  date: string;
  time: string;
  deposit: string;
}

export function bookingConfirmationEmail(data: BookingEmailData) {
  return {
    subject: "Tu reserva está confirmada | L'Atelier Nails",

    html: `
      <div style="background:#FAF9F7;padding:40px 15px;font-family:Arial,sans-serif;">
        <div style="max-width:560px;margin:auto;background:white;padding:35px;border-radius:16px;">

          <h1 style="font-family:Georgia,serif;text-align:center;color:#2D2C28;">
            L'Atelier Nails
          </h1>

          <p style="text-align:center;color:#878378;letter-spacing:2px;">
            BELLEZA · CUIDADO · ELEGANCIA
          </p>

          <hr style="border:none;border-top:1px solid #E3DAC9;margin:25px 0;">

          <h2 style="color:#2D2C28;">
            ¡Tu cita está confirmada!
          </h2>

          <p>Hola ${data.customerName},</p>

          <p>Hemos recibido tu reserva correctamente. ¡Estamos deseando verte!</p>

          <div style="background:#F1EDE4;padding:20px;border-radius:12px;line-height:1.8;">
            <strong>Servicio:</strong> ${data.serviceName}<br>
            <strong>Fecha:</strong> ${data.date}<br>
            <strong>Hora:</strong> ${data.time}<br>
            <strong>Anticipo:</strong> ${data.deposit}
          </div>

          <p style="margin-top:25px;">
            Gracias por confiar en nosotros.
          </p>

          <p style="font-family:Georgia,serif;font-size:18px;">
            L'Atelier Nails
          </p>

          <hr style="border:none;border-top:1px solid #E3DAC9;margin:25px 0;">

          <p style="font-size:11px;color:#878378;text-align:center;">
            Este correo ha sido enviado automáticamente.
          </p>

        </div>
      </div>
    `,
  };
}