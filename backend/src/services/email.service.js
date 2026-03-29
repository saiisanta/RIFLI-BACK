// services/email.service.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Estilos base compartidos (siguiendo el diseño de profile)
const emailBaseStyles = `
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background: #0a0a0a;
    color: #ffffff;
  }
  .email-wrapper {
    background: #0a0a0a;
    padding: 40px 20px;
  }
  .email-container {
    max-width: 600px;
    margin: 0 auto;
    background: #1a1a1a;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  }
  .email-header {
    background: linear-gradient(135deg, #ffca2c 0%, #ffd95a 100%);
    padding: 40px 30px;
    text-align: center;
    position: relative;
  }
  .email-header::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.3;
  }
  .email-header-icon {
    font-size: 48px;
    margin-bottom: 12px;
    position: relative;
  }
  .email-header-title {
    font-size: 28px;
    font-weight: 900;
    color: #000000;
    margin: 0;
    letter-spacing: -0.5px;
    position: relative;
  }
  .email-content {
    padding: 40px 30px;
    background: #151515;
  }
  .email-text {
    color: #ffffff;
    font-size: 16px;
    line-height: 1.6;
    margin: 0 0 20px 0;
  }
  .email-text-muted {
    color: #9ca3af;
  }

   a {
    color: inherit;
    text-decoration: none;
  }
  .email-button {
    display: inline-block;
    padding: 16px 32px;
    background: linear-gradient(135deg, #ffca2c 0%, #ffd95a 100%);
    color: #000000 !important;
    text-decoration: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 700;
    margin: 24px 0;
    box-shadow: 0 4px 12px rgba(255, 202, 44, 0.3);
    transition: all 0.3s ease;
  }
  .email-info-box {
    background: rgba(255, 202, 44, 0.05);
    border-left: 4px solid #ffca2c;
    padding: 20px;
    margin: 24px 0;
    border-radius: 8px;
  }
  .email-warning-box {
    background: rgba(239, 68, 68, 0.1);
    border-left: 4px solid #ef4444;
    padding: 20px;
    margin: 24px 0;
    border-radius: 8px;
  }
  .email-success-box {
    background: rgba(16, 185, 129, 0.1);
    border-left: 4px solid #10b981;
    padding: 20px;
    margin: 24px 0;
    border-radius: 8px;
  }
  .email-url-box {
    background: #0a0a0a;
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 16px;
    border-radius: 8px;
    word-break: break-all;
    font-size: 14px;
    color: #9ca3af;
    margin: 20px 0;
  }
  .email-table {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    background: #0a0a0a;
    border-radius: 12px;
    overflow: hidden;
  }
  .email-table th {
    background: #1a1a1a;
    padding: 12px;
    text-align: left;
    font-weight: 700;
    color: #9ca3af;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .email-table td {
    padding: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    color: #ffffff;
  }
  .email-badge {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .badge-warning {
    background: rgba(255, 202, 44, 0.15);
    color: #ffca2c;
    border: 1px solid rgba(255, 202, 44, 0.3);
  }
  .badge-success {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.3);
  }
  .badge-danger {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.3);
  }
  .email-footer {
    padding: 30px;
    text-align: center;
    background: #0a0a0a;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }
  .email-footer-text {
    color: #6b7280;
    font-size: 14px;
    margin: 8px 0;
  }
  .email-logo {
    font-size: 24px;
    font-weight: 900;
    color: #ffca2c;
    margin-bottom: 12px;
    letter-spacing: -0.5px;
  }

   .email-button:link,
  .email-button:visited,
  .email-button:hover,
  .email-button:active {
    color: #000000 !important;
    text-decoration: none !important;
  }
    
  @media only screen and (max-width: 600px) {
    .email-wrapper {
      padding: 20px 10px;
    }
    .email-content {
      padding: 30px 20px;
    }
    .email-header {
      padding: 30px 20px;
    }
    .email-header-title {
      font-size: 24px;
    }
  }
`;

// Mail de recuperación de contraseña
export const sendPasswordResetEmail = async ({ to, resetToken }) => {
  const resetUrl = `${process.env.FRONTEND_URL}reset-password/${resetToken}`;

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: to,
      subject: "🔐 Recuperación de contraseña - RIFLI",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>${emailBaseStyles}</style>
          </head>
          <body>
            <div class="email-wrapper">
              <div class="email-container">
                <div class="email-header">
                  <div class="email-header-icon">🔐</div>
                  <h1 class="email-header-title">Recuperación de Contraseña</h1>
                </div>
                
                <div class="email-content">
                  <p class="email-text">
                    Hola,
                  </p>
                  <p class="email-text">
                    Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>RIFLI</strong>.
                  </p>
                  <p class="email-text">
                    Hacé click en el siguiente botón para crear una nueva contraseña:
                  </p>
                  
                  <center>
                    <a href="${resetUrl}" class="email-button">Restablecer Contraseña</a>
                  </center>
                  
                  <p class="email-text email-text-muted" style="font-size: 14px;">
                    O copiá y pegá este enlace en tu navegador:
                  </p>
                  <div class="email-url-box">
                    ${resetUrl}
                  </div>
                  
                  <div class="email-warning-box">
                    <strong style="color: #ef4444;">⚠️ Importante:</strong>
                    <p style="margin: 8px 0 0 0; color: #9ca3af;">
                      Este enlace expira en <strong style="color: #ffffff;">1 hora</strong>.
                    </p>
                  </div>
                  
                  <p class="email-text email-text-muted" style="font-size: 14px;">
                    Si no solicitaste este cambio, podés ignorar este email. Tu contraseña permanecerá sin cambios.
                  </p>
                </div>
                
                <div class="email-footer">
                  <div class="email-logo">RIFLI</div>
                  <p class="email-footer-text">Este es un email automático, por favor no respondas.</p>
                  <p class="email-footer-text">&copy; ${new Date().getFullYear()} RIFLI. Todos los derechos reservados.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Error enviando email:", error);
      throw new Error("Error al enviar el email");
    }

    console.log("✅ Email enviado:", data);
    return data;
  } catch (error) {
    console.error("Error en sendPasswordResetEmail:", error);
    throw error;
  }
};

// Mail de verificación de email
export const sendVerificationEmail = async ({
  to,
  verificationToken,
  userName,
}) => {
  const verificationUrl = `${process.env.FRONTEND_URL}verify-email/${verificationToken}`;

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: to,
      subject: "✉️ Verificá tu cuenta en RIFLI",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>${emailBaseStyles}</style>
          </head>
          <body>
            <div class="email-wrapper">
              <div class="email-container">
                <div class="email-header">
                  <div class="email-header-icon">🎉</div>
                  <h1 class="email-header-title">¡Bienvenido a RIFLI!</h1>
                </div>
                
                <div class="email-content">
                  <p class="email-text">
                    Hola <strong>${userName}</strong>,
                  </p>
                  <p class="email-text">
                    ¡Gracias por registrarte en RIFLI! Estamos emocionados de tenerte con nosotros.
                  </p>
                  <p class="email-text">
                    Para completar tu registro y activar tu cuenta, por favor verificá tu dirección de email:
                  </p>
                  
                  <center>
                    <a href="${verificationUrl}" class="email-button">✓ Verificar mi email</a>
                  </center>
                  
                  <p class="email-text email-text-muted" style="font-size: 14px;">
                    O copiá y pegá este enlace en tu navegador:
                  </p>
                  <div class="email-url-box">
                    ${verificationUrl}
                  </div>
                  
                  <div class="email-info-box">
                    <strong style="color: #ffca2c;">ℹ️ Importante:</strong>
                    <p style="margin: 8px 0 0 0; color: #9ca3af;">
                      Este enlace expira en <strong style="color: #ffffff;">24 horas</strong>. Si no verificás tu email en ese tiempo, deberás solicitar un nuevo enlace.
                    </p>
                  </div>
                  
                  <p class="email-text email-text-muted" style="font-size: 14px;">
                    Si no creaste una cuenta en RIFLI, podés ignorar este email.
                  </p>
                  
                  <p class="email-text" style="margin-top: 30px;">
                    ¡Nos vemos pronto! 👋
                  </p>
                  <p class="email-text">
                    <strong>El equipo de RIFLI</strong>
                  </p>
                </div>
                
                <div class="email-footer">
                  <div class="email-logo">RIFLI</div>
                  <p class="email-footer-text">Este es un email automático, por favor no respondas.</p>
                  <p class="email-footer-text">&copy; ${new Date().getFullYear()} RIFLI. Todos los derechos reservados.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Error enviando email de verificación:", error);
      throw new Error("Error al enviar el email");
    }

    console.log("✅ Email de verificación enviado:", data);
    return data;
  } catch (error) {
    console.error("Error en sendVerificationEmail:", error);
    throw error;
  }
};

// Mail de cambio de estado de Quote
export const sendQuoteStatusEmail = async ({
  to,
  userName,
  quote,
  title,
  message,
}) => {
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
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>${emailBaseStyles}</style>
          </head>
          <body>
            <div class="email-wrapper">
              <div class="email-container">
                <div class="email-header">
                  <div class="email-header-icon">📋</div>
                  <h1 class="email-header-title">Actualización de Presupuesto</h1>
                </div>
                
                <div class="email-content">
                  <p class="email-text">
                    Hola <strong>${userName}</strong>,
                  </p>
                  
                  <div class="email-info-box">
                    <strong style="color: #ffca2c; font-size: 16px;">${title}</strong>
                    <p style="margin: 12px 0 0 0; color: #ffffff; font-size: 15px;">
                      ${message}
                    </p>
                  </div>
                  
                  <p class="email-text">
                    Podés ver todos los detalles de tu presupuesto <strong>#${quote.quote_number}</strong> desde tu cuenta:
                  </p>
                  
                  <center>
                    <a href="${process.env.FRONTEND_URL}/presupuestos" class="email-button">Ver presupuesto</a>
                  </center>
                  
                  <p class="email-text email-text-muted" style="font-size: 14px; margin-top: 30px;">
                    Si tenés dudas, contactanos por WhatsApp.
                  </p>
                </div>
                
                <div class="email-footer">
                  <div class="email-logo">RIFLI</div>
                  <p class="email-footer-text">Este es un email automático, por favor no respondas.</p>
                  <p class="email-footer-text">&copy; ${new Date().getFullYear()} RIFLI. Todos los derechos reservados.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
      headers: {
        "X-Entity-Ref-ID": new Date().getTime().toString(),
      },
      tags: [
        {
          name: "click_tracking",
          value: "false",
        },
      ],
    });

    if (error) throw new Error("Error al enviar email de estado de quote");
    console.log("✅ Email de estado de quote enviado:", data);
    return data;
  } catch (error) {
    console.error("Error en sendQuoteStatusEmail:", error);
    throw error;
  }
};

// Mail de cambio de estado de pago (quote)
export const sendPaymentStatusEmail = async ({
  to,
  userName,
  quote,
  paymentType,
  status,
}) => {
  const isDeposit = paymentType === "deposit";
  const paymentLabel = isDeposit ? "seña" : "pago final";
  const isApproved = status === "PAID";

  const subject = isApproved
    ? `✅ Tu ${paymentLabel} fue aprobado - RIFLI`
    : `⚠️ Comprobante de ${paymentLabel} rechazado - RIFLI`;

  const headerIcon = isApproved ? "✅" : "⚠️";
  const headerText = isApproved ? "Pago Aprobado" : "Pago Rechazado";

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
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>${emailBaseStyles}</style>
          </head>
          <body>
            <div class="email-wrapper">
              <div class="email-container">
                <div class="email-header">
                  <div class="email-header-icon">${headerIcon}</div>
                  <h1 class="email-header-title">${headerText}</h1>
                </div>
                
                <div class="email-content">
                  <p class="email-text">
                    Hola <strong>${userName}</strong>,
                  </p>
                  
                  ${
                    isApproved
                      ? `<div class="email-success-box">
                        <strong style="color: #10b981; font-size: 16px;">✓ Comprobante Verificado</strong>
                        <p style="margin: 12px 0 0 0; color: #ffffff;">
                          Tu comprobante de <strong>${paymentLabel}</strong> del presupuesto <strong>#${quote.quote_number}</strong> fue verificado y aprobado exitosamente.
                        </p>
                      </div>`
                      : `<div class="email-warning-box">
                        <strong style="color: #ef4444; font-size: 16px;">✗ Comprobante Rechazado</strong>
                        <p style="margin: 12px 0 0 0; color: #ffffff;">
                          Tu comprobante de <strong>${paymentLabel}</strong> del presupuesto <strong>#${quote.quote_number}</strong> fue rechazado. Por favor ingresá a tu cuenta y subí un nuevo comprobante.
                        </p>
                      </div>`
                  }
                  
                  <center>
                    <a href="${process.env.FRONTEND_URL}/presupuestos" class="email-button">Ver presupuesto</a>
                  </center>
                  
                  <p class="email-text email-text-muted" style="font-size: 14px; margin-top: 30px;">
                    Si tenés dudas, contactanos por WhatsApp.
                  </p>
                </div>
                
                <div class="email-footer">
                  <div class="email-logo">RIFLI</div>
                  <p class="email-footer-text">Este es un email automático, por favor no respondas.</p>
                  <p class="email-footer-text">&copy; ${new Date().getFullYear()} RIFLI. Todos los derechos reservados.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
      headers: {
        "X-Entity-Ref-ID": new Date().getTime().toString(),
      },
      tags: [
        {
          name: "click_tracking",
          value: "false",
        },
      ],
    });

    if (error) throw new Error("Error al enviar email de pago");
    console.log("✅ Email de pago enviado:", data);
    return data;
  } catch (error) {
    console.error("Error en sendPaymentStatusEmail:", error);
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
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>${emailBaseStyles}</style>
          </head>
          <body>
            <div class="email-wrapper">
              <div class="email-container">
                <div class="email-header">
                  <div class="email-header-icon">📦</div>
                  <h1 class="email-header-title">${title}</h1>
                </div>
                
                <div class="email-content">
                  <p class="email-text">
                    Hola <strong>${userName}</strong>,
                  </p>
                  <p class="email-text">
                    Tu pedido <strong>#${order.order_number}</strong> tiene una novedad:
                  </p>
                  
                  <table class="email-table">
                    <tr>
                      <td style="color: #9ca3af; font-weight: 600;">Número de pedido</td>
                      <td style="text-align: right;"><strong>#${order.order_number}</strong></td>
                    </tr>
                    <tr>
                      <td style="color: #9ca3af; font-weight: 600;">Estado</td>
                      <td style="text-align: right;">
                        <span class="email-badge badge-warning">${order.status}</span>
                      </td>
                    </tr>
                    ${
                      order.tracking_number
                        ? `
                    <tr>
                      <td style="color: #9ca3af; font-weight: 600;">Seguimiento</td>
                      <td style="text-align: right;"><strong>${order.tracking_number}</strong></td>
                    </tr>
                    `
                        : ""
                    }
                  </table>
                  
                  <center>
                    <a href="${process.env.FRONTEND_URL}/pedidos/${order.id}" class="email-button">Ver mi pedido</a>
                  </center>
                </div>
                
                <div class="email-footer">
                  <div class="email-logo">RIFLI</div>
                  <p class="email-footer-text">Este es un email automático, por favor no respondas.</p>
                  <p class="email-footer-text">&copy; ${new Date().getFullYear()} RIFLI. Todos los derechos reservados.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
      headers: {
        "X-Entity-Ref-ID": new Date().getTime().toString(),
      },
      tags: [
        {
          name: "click_tracking",
          value: "false",
        },
      ],
    });

    if (error) throw new Error("Error al enviar email de orden");
    console.log("✅ Email de orden enviado:", data);
    return data;
  } catch (error) {
    console.error("Error en sendOrderStatusEmail:", error);
    throw error;
  }
};

// Mail nueva orden generada por usuario (para admin)
export const sendAdminNewOrderEmail = async ({ to, userName, order }) => {
  const items = order.items
    .map(
      (item) =>
        `<tr>
      <td style="padding: 12px; border-top: 1px solid rgba(255, 255, 255, 0.08); color: #ffffff;">${item.name}</td>
      <td style="padding: 12px; border-top: 1px solid rgba(255, 255, 255, 0.08); text-align: center; color: #ffffff;">${item.quantity}</td>
      <td style="padding: 12px; border-top: 1px solid rgba(255, 255, 255, 0.08); text-align: right; color: #ffffff;">$${Number(item.unit_price).toLocaleString("es-AR")}</td>
      <td style="padding: 12px; border-top: 1px solid rgba(255, 255, 255, 0.08); text-align: right; font-weight: 700; color: #ffca2c;">$${Number(item.subtotal).toLocaleString("es-AR")}</td>
    </tr>`,
    )
    .join("");

  const address = order.shipping_address_snapshot;

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject: `🛒 Nueva orden #${order.order_number} - RIFLI`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>${emailBaseStyles}</style>
          </head>
          <body>
            <div class="email-wrapper">
              <div class="email-container">
                <div class="email-header">
                  <div class="email-header-icon">🛒</div>
                  <h1 class="email-header-title">Nueva Orden de Compra</h1>
                  <p style="margin: 8px 0 0 0; font-size: 18px; color: rgba(0, 0, 0, 0.7); font-weight: 600;">
                    Orden #${order.order_number}
                  </p>
                </div>
                
                <div class="email-content">
                  <p class="email-text">
                    Hola <strong>${userName}</strong>,
                  </p>
                  <p class="email-text">
                    Se recibió una nueva orden que requiere cotización de envío.
                  </p>
                  
                  <div class="email-info-box">
                    <strong style="color: #ffca2c; font-size: 16px;">⚠️ Acción Requerida</strong>
                    <p style="margin: 8px 0 0 0; color: #9ca3af;">
                      Esta orden necesita que cotices y configures el costo de envío antes de ser procesada.
                    </p>
                  </div>
                  
                  <h3 style="color: #ffca2c; margin: 32px 0 16px 0; font-size: 18px; font-weight: 700; border-bottom: 2px solid rgba(255, 202, 44, 0.2); padding-bottom: 8px;">
                    📦 Productos
                  </h3>
                  <table class="email-table">
                    <thead>
                      <tr style="background: #1a1a1a;">
                        <th style="padding: 12px; text-align: left; font-weight: 700; color: #9ca3af; font-size: 14px;">Producto</th>
                        <th style="padding: 12px; text-align: center; font-weight: 700; color: #9ca3af; font-size: 14px;">Cant.</th>
                        <th style="padding: 12px; text-align: right; font-weight: 700; color: #9ca3af; font-size: 14px;">Precio unit.</th>
                        <th style="padding: 12px; text-align: right; font-weight: 700; color: #9ca3af; font-size: 14px;">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${items}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colspan="3" style="padding: 16px 12px; text-align: right; font-weight: 700; color: #ffffff; border-top: 2px solid rgba(255, 255, 255, 0.1);">
                          Subtotal productos:
                        </td>
                        <td style="padding: 16px 12px; text-align: right; font-weight: 900; color: #ffca2c; font-size: 18px; border-top: 2px solid rgba(255, 255, 255, 0.1);">
                          $${Number(order.subtotal).toLocaleString("es-AR")}
                        </td>
                      </tr>
                      <tr style="background: rgba(255, 202, 44, 0.1);">
                        <td colspan="3" style="padding: 12px; text-align: right; font-weight: 700; color: #ffffff;">
                          🚚 Envío:
                        </td>
                        <td style="padding: 12px; text-align: right; font-weight: 700; color: #ffca2c;">
                          Pendiente
                        </td>
                      </tr>
                    </tfoot>
                  </table>

                  <h3 style="color: #ffca2c; margin: 32px 0 16px 0; font-size: 18px; font-weight: 700; border-bottom: 2px solid rgba(255, 202, 44, 0.2); padding-bottom: 8px;">
                    📍 Dirección de entrega
                  </h3>
                  <div style="background: #0a0a0a; border: 1px solid rgba(255, 255, 255, 0.08); padding: 20px; border-radius: 12px; margin: 0;">
                    <p style="color: #ffffff; font-size: 16px; line-height: 1.8; margin: 0;">
                      <strong>${address.street} ${address.number}</strong><br/>
                      ${address.city}, ${address.province}<br/>
                      <span style="color: #9ca3af;">CP:</span> <strong>${address.postal_code}</strong>
                    </p>
                  </div>

                  <center style="margin-top: 32px;">
                    <a href="${process.env.FRONTEND_URL}/admin/pedidos/${order.id}" class="email-button">
                      Ver orden y cotizar envío
                    </a>
                  </center>
                </div>
                
                <div class="email-footer">
                  <div class="email-logo">RIFLI</div>
                  <p class="email-footer-text">Este es un email automático, por favor no respondas.</p>
                  <p class="email-footer-text">&copy; ${new Date().getFullYear()} RIFLI. Todos los derechos reservados.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
      headers: {
        "X-Entity-Ref-ID": new Date().getTime().toString(),
      },
      tags: [
        {
          name: "click_tracking",
          value: "false",
        },
      ],
    });

    if (error) throw new Error("Error al enviar email de nueva orden");
    console.log("✅ Email de nueva orden enviado:", data);
    return data;
  } catch (error) {
    console.error("Error en sendAdminNewOrderEmail:", error);
    throw error;
  }
};
