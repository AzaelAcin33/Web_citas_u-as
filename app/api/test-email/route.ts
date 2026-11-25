import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { sendEmail } from "@/lib/email";

export async function POST() {
  // Comprobar permisos antes de enviar
  const { user } = await requireAdmin();

  if (user.email !== "admin@lateliernails.es") {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 403 }
    );
  }

  try {
    const result = await sendEmail({
      to: "goodtester24@gmail.com",
      subject: "Prueba de correo | L'Atelier Nails",
      html: `
        <div style="font-family:Arial;padding:30px;background:#FAF9F7;">
          <div style="max-width:500px;margin:auto;background:white;padding:30px;border-radius:15px;">
            <h1 style="font-family:Georgia;color:#2D2C28;">
              L'Atelier Nails
            </h1>
            <h2>¡Correo de prueba recibido!</h2>
            <p>El sistema de envío de correos está funcionando correctamente.</p>
            <p>Ya podemos preparar las confirmaciones automáticas de reservas.</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      id: result?.id,
    });
  } catch (error) {
    console.error("Error enviando correo:", error);

    return NextResponse.json(
      { error: "No se pudo enviar el correo de prueba." },
      { status: 500 }
    );
  }
}