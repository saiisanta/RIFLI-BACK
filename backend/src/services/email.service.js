// services/email.service.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Mail de recuperación de contraseña 
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

// Mail de verificación de email
export const sendVerificationEmail = async ({ to, verificationToken, userName }) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: to,
      subject: '✉️ Verificá tu cuenta en RIFLI',
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
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px 20px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .content {
                background-color: #ffffff;
                padding: 40px 30px;
                border: 1px solid #e0e0e0;
                border-top: none;
              }
              .button {
                display: inline-block;
                padding: 15px 30px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-decoration: none;
                border-radius: 25px;
                margin: 25px 0;
                font-weight: bold;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                color: #666;
                font-size: 12px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
              }
              .info-box {
                background-color: #f0f7ff;
                border-left: 4px solid #2196F3;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
              }
              .welcome-icon {
                font-size: 50px;
                margin-bottom: 10px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="welcome-icon">🎉</div>
                <h1 style="margin: 0;">¡Bienvenido a RIFLI!</h1>
              </div>
              <div class="content">
                <p>Hola <strong>${userName}</strong>,</p>
                <p>¡Gracias por registrarte en RIFLI! Estamos emocionados de tenerte con nosotros.</p>
                <p>Para completar tu registro y activar tu cuenta, por favor verificá tu dirección de email haciendo click en el botón de abajo:</p>
                
                <center>
                  <a href="${verificationUrl}" class="button">✓ Verificar mi email</a>
                </center>
                
                <p>O copiá y pegá este enlace en tu navegador:</p>
                <p style="background-color: #f5f5f5; padding: 12px; border-radius: 5px; word-break: break-all; font-size: 14px;">
                  ${verificationUrl}
                </p>
                
                <div class="info-box">
                  <strong>ℹ️ Importante:</strong> Este enlace expira en <strong>24 horas</strong>. Si no verificás tu email en ese tiempo, deberás solicitar un nuevo enlace.
                </div>
                
                <p>Si no creaste una cuenta en RIFLI, podés ignorar este email.</p>
                
                <p style="margin-top: 30px;">¡Nos vemos pronto! 👋</p>
                <p><strong>El equipo de RIFLI</strong></p>
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
      console.error('Error enviando email de verificación:', error);
      throw new Error('Error al enviar el email');
    }

    console.log('✅ Email de verificación enviado:', data);
    return data;
  } catch (error) {
    console.error('Error en sendVerificationEmail:', error);
    throw error;
  }
};