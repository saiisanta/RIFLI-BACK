// services/email.service.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Mail de recuperación de contraseña 
export const sendPasswordResetEmail = async ({ to, resetToken }) => {
  const resetUrl = `${process.env.FRONTEND_URL}reset-password/${resetToken}`;

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
  const verificationUrl = `${process.env.FRONTEND_URL}verify-email/${verificationToken}`;

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

// Mail de cambio de estado de Quote 
export const sendQuoteStatusEmail = async ({ to, userName, quote, title, message }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject: `${title} - RIFLI`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 25px 20px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background-color: #ffffff; padding: 35px 30px; border: 1px solid #e0e0e0; border-top: none; }
              .button { display: inline-block; padding: 13px 28px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
              .status-box { background-color: #f0f4ff; border-left: 4px solid #3a86ff; padding: 15px; margin: 20px 0; border-radius: 4px; }
              .footer { text-align: center; margin-top: 25px; color: #888; font-size: 12px; padding-top: 20px; border-top: 1px solid #e0e0e0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="margin:0;">Actualización de Presupuesto</h2>
              </div>
              <div class="content">
                <p>Hola <strong>${userName}</strong>,</p>
                <div class="status-box">
                  <strong>${title}</strong><br/>
                  <p style="margin: 8px 0 0;">${message}</p>
                </div>
                <p>Podés ver todos los detalles de tu presupuesto <strong>#${quote.quote_number}</strong> desde tu cuenta:</p>
                <center>
                  <a href="${process.env.FRONTEND_URL}presupuestos/${quote.id}" class="button">Ver presupuesto</a>
                </center>
                <p>Si tenés dudas, contactanos por WhatsApp.</p>
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

    if (error) throw new Error('Error al enviar email de estado de quote');
    console.log('Email de estado de quote enviado:', data);
    return data;
  } catch (error) {
    console.error('Error en sendQuoteStatusEmail:', error);
    throw error;
  }
};

// Mail de cambio de estado de pago (quote) 
export const sendPaymentStatusEmail = async ({ to, userName, quote, paymentType, status }) => {
  const isDeposit = paymentType === 'deposit';
  const paymentLabel = isDeposit ? 'seña' : 'pago final';
  const isApproved = status === 'PAID';

  const subject = isApproved
    ? `✅ Tu ${paymentLabel} fue aprobado - RIFLI`
    : `⚠️ Comprobante de ${paymentLabel} rechazado - RIFLI`;

  const headerColor = isApproved ? '#2e7d32' : '#c62828';
  const boxColor   = isApproved ? '#f1f8e9' : '#fff3f3';
  const boxBorder  = isApproved ? '#66bb6a' : '#ef9a9a';

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: ${headerColor}; color: white; padding: 25px 20px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background-color: #ffffff; padding: 35px 30px; border: 1px solid #e0e0e0; border-top: none; }
              .status-box { background-color: ${boxColor}; border-left: 4px solid ${boxBorder}; padding: 15px; margin: 20px 0; border-radius: 4px; }
              .button { display: inline-block; padding: 13px 28px; background-color: ${headerColor}; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
              .footer { text-align: center; margin-top: 25px; color: #888; font-size: 12px; padding-top: 20px; border-top: 1px solid #e0e0e0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="margin:0;">${isApproved ? '✅' : '⚠️'} Pago ${isApproved ? 'aprobado' : 'rechazado'}</h2>
              </div>
              <div class="content">
                <p>Hola <strong>${userName}</strong>,</p>
                <div class="status-box">
                  ${isApproved
                    ? `<p>Tu comprobante de <strong>${paymentLabel}</strong> del presupuesto <strong>#${quote.quote_number}</strong> fue verificado y aprobado.</p>`
                    : `<p>Tu comprobante de <strong>${paymentLabel}</strong> del presupuesto <strong>#${quote.quote_number}</strong> fue rechazado. Por favor ingresá a tu cuenta y subí un nuevo comprobante.</p>`
                  }
                </div>
                <center>
                  <a href="${process.env.FRONTEND_URL}presupuestos/${quote.id}" class="button">Ver presupuesto</a>
                </center>
                <p>Si tenés dudas, contactanos por WhatsApp.</p>
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

    if (error) throw new Error('Error al enviar email de pago');
    console.log('✅ Email de pago enviado:', data);
    return data;
  } catch (error) {
    console.error('Error en sendPaymentStatusEmail:', error);
    throw error;
  }
};

// Mail de cambio de estado de Order 
export const sendOrderStatusEmail = async ({ to, userName, order, title }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject: `${title} - RIFLI`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #4CAF50 0%, #2e7d32 100%); color: white; padding: 25px 20px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background-color: #ffffff; padding: 35px 30px; border: 1px solid #e0e0e0; border-top: none; }
              .button { display: inline-block; padding: 13px 28px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
              .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
              .footer { text-align: center; margin-top: 25px; color: #888; font-size: 12px; padding-top: 20px; border-top: 1px solid #e0e0e0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="margin:0;">${title}</h2>
              </div>
              <div class="content">
                <p>Hola <strong>${userName}</strong>,</p>
                <p>Tu pedido <strong>#${order.order_number}</strong> tiene una novedad:</p>
                <table width="100%" cellpadding="8" style="border-collapse: collapse; background: #f9f9f9; border-radius: 6px;">
                  <tr><td style="color:#666;">Número de pedido</td><td><strong>#${order.order_number}</strong></td></tr>
                  <tr><td style="color:#666;">Estado</td><td><strong>${order.status}</strong></td></tr>
                  ${order.tracking_number ? `<tr><td style="color:#666;">Seguimiento</td><td><strong>${order.tracking_number}</strong></td></tr>` : ''}
                </table>
                <center>
                  <a href="${process.env.FRONTEND_URL}pedidos/${order.id}" class="button">Ver mi pedido</a>
                </center>
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

    if (error) throw new Error('Error al enviar email de orden');
    console.log('✅ Email de orden enviado:', data);
    return data;
  } catch (error) {
    console.error('Error en sendOrderStatusEmail:', error);
    throw error;
  }
};