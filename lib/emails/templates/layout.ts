interface EmailLayoutOptions {
    title: string;
    preview: string;
    content: string;
}

export function emailLayout({
    title,
    preview,
    content,
}: EmailLayoutOptions) {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>

<body style="margin:0;padding:0;background:#FAF9F7;font-family:Arial,sans-serif;color:#2D2C28;">

  <div style="display:none;max-height:0;overflow:hidden;">
    ${preview}
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:35px 15px;">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0"
          style="max-width:560px;background:#FFFFFF;border-radius:16px;overflow:hidden;">

          <tr>
            <td style="padding:35px 30px;text-align:center;background:#F1EDE4;">

              <h1 style="margin:0;font-family:Georgia,serif;font-size:30px;font-weight:400;">
                L'Atelier Nails
              </h1>

              <p style="margin:10px 0 0;font-size:10px;letter-spacing:3px;color:#878378;">
                BELLEZA · CUIDADO · ELEGANCIA
              </p>

            </td>
          </tr>

          <tr>
            <td style="padding:35px 30px;">

              ${content}

            </td>
          </tr>

          <tr>
            <td style="padding:25px 30px;background:#F1EDE4;text-align:center;">

              <p style="margin:0;font-family:Georgia,serif;font-size:17px;">
                L'Atelier Nails
              </p>

              <p style="font-size:11px;color:#878378;line-height:1.6;margin:10px 0 0;">
                Gracias por confiar en nosotros.<br>
                Este correo se ha enviado automáticamente.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
}