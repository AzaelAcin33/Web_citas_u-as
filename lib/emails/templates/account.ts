import { emailLayout } from "./layout";

interface AccountEmailData {
    name?: string;
    actionUrl?: string;
}

export function welcomeEmail(data: AccountEmailData) {
    return {
        subject: "¡Bienvenida a L'Atelier Nails!",
        html: emailLayout({
            title: "Bienvenida",
            preview: "Gracias por formar parte de L'Atelier Nails.",
            content: `
        <h2 style="font-family:Georgia,serif;font-weight:400;">
          ¡Bienvenida${data.name ? `, ${data.name}` : ""}!
        </h2>

        <p>Gracias por crear tu cuenta en L'Atelier Nails.</p>

        <p>Desde tu cuenta podrás gestionar tus reservas, consultar tus citas y descubrir nuestras formaciones.</p>

        <p>¡Estamos encantados de tenerte con nosotros!</p>
      `,
        }),
    };
}

export function verifyAccountEmail(data: AccountEmailData) {
    return {
        subject: "Verifica tu cuenta | L'Atelier Nails",
        html: emailLayout({
            title: "Verificación de cuenta",
            preview: "Confirma tu dirección de correo electrónico.",
            content: `
        <h2 style="font-family:Georgia,serif;font-weight:400;">
          Confirma tu correo electrónico
        </h2>

        <p>Para activar tu cuenta de L'Atelier Nails, confirma tu dirección de correo.</p>

        <div style="text-align:center;margin:30px 0;">
          <a href="${data.actionUrl ?? "#"}"
             style="display:inline-block;padding:14px 28px;background:#2D2C28;color:#FFFFFF;text-decoration:none;border-radius:8px;">
            Verificar mi cuenta
          </a>
        </div>

        <p style="font-size:12px;color:#878378;">
          Si no has creado esta cuenta, puedes ignorar este mensaje.
        </p>
      `,
        }),
    };
}

export function passwordRecoveryEmail(data: AccountEmailData) {
    return {
        subject: "Recuperación de contraseña | L'Atelier Nails",
        html: emailLayout({
            title: "Recuperar contraseña",
            preview: "Solicitaste cambiar tu contraseña.",
            content: `
        <h2 style="font-family:Georgia,serif;font-weight:400;">
          Recupera tu contraseña
        </h2>

        <p>Hemos recibido una solicitud para cambiar la contraseña de tu cuenta.</p>

        <div style="text-align:center;margin:30px 0;">
          <a href="${data.actionUrl ?? "#"}"
             style="display:inline-block;padding:14px 28px;background:#2D2C28;color:#FFFFFF;text-decoration:none;border-radius:8px;">
            Cambiar contraseña
          </a>
        </div>

        <p style="font-size:12px;color:#878378;">
          Si no has solicitado este cambio, ignora este correo.
        </p>
      `,
        }),
    };
}

export function passwordChangedEmail(data: AccountEmailData) {
    return {
        subject: "Tu contraseña ha cambiado | L'Atelier Nails",
        html: emailLayout({
            title: "Contraseña actualizada",
            preview: "La contraseña de tu cuenta se ha actualizado.",
            content: `
        <h2 style="font-family:Georgia,serif;font-weight:400;">
          Contraseña actualizada
        </h2>

        <p>Hola${data.name ? ` ${data.name}` : ""},</p>

        <p>Te confirmamos que la contraseña de tu cuenta de L'Atelier Nails se ha cambiado correctamente.</p>

        <p>Si no has realizado este cambio, ponte en contacto con nosotros.</p>
      `,
        }),
    };
}