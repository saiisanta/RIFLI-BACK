// services/email.service.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async ({ to, resetToken }) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: to,
      subject: 'Recuperación de contraseña - RIFLI',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background-color: #4CAF50;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 5px 5px 0 0;
              }
              .content {
                background-color: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 5px 5px;
              }
              .button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #4CAF50;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                color: #666;
                font-size: 12px;
              }
              .warning {
                background-color: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 10px;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Recuperación de Contraseña</h1>
              </div>
              <div class="content">
                <p>Hola,</p>
                <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>RIFLI</strong>.</p>
                <p>Hacé click en el siguiente botón para crear una nueva contraseña:</p>
                
                <center>
                  <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
                </center>
                
                <p>O copiá y pegá este enlace en tu navegador:</p>
                <p style="background-color: #e9ecef; padding: 10px; border-radius: 3px; word-break: break-all;">
                  ${resetUrl}
                </p>
                
                <div class="warning">
                  <strong>⚠️ Importante:</strong> Este enlace expira en <strong>1 hora</strong>.
                </div>
                
                <p>Si no solicitaste este cambio, podés ignorar este email. Tu contraseña permanecerá sin cambios.</p>
              </div>
              <div class="footer">
                <p>Este es un email automático, por favor no respondas.</p>
                <p>&copy; ${new Date().getFullYear()} RIFLI. Todos los derechos reservados.</p>
              </div>
            </div>
          </body>
        </html>
      `
    });

    if (error) {
      console.error('Error enviando email:', error);
      throw new Error('Error al enviar el email');
    }

    console.log('✅ Email enviado:', data);
    return data;
  } catch (error) {
    console.error('Error en sendPasswordResetEmail:', error);
    throw error;
  }
};