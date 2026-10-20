const nodemailer = require('nodemailer');

// Validación de email
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Sanitizar texto para HTML
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

module.exports = async (req, res) => {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const { name, email, company, topic, message, consent, _gotcha, _timestamp } = req.body;

    // Honeypot: si viene relleno, simular éxito pero no enviar
    if (_gotcha && _gotcha.trim() !== '') {
      return res.status(200).json({ ok: true });
    }

    // Validar timestamp (protección contra bots rápidos)
    if (_timestamp) {
      const submitTime = Date.now();
      const loadTime = parseInt(_timestamp, 10);
      if (submitTime - loadTime < 3000) {
        return res.status(400).json({ ok: false, error: 'Too fast' });
      }
    }

    // Validación de campos obligatorios
    if (!name || !email || !message || !consent) {
      return res.status(400).json({ ok: false, error: 'Missing required fields' });
    }

    // Validar email
    if (!isValidEmail(email)) {
      return res.status(400).json({ ok: false, error: 'Invalid email' });
    }

    // Límites de longitud
    if (name.length > 100) {
      return res.status(400).json({ ok: false, error: 'Name too long' });
    }
    if (email.length > 100) {
      return res.status(400).json({ ok: false, error: 'Email too long' });
    }
    if (company && company.length > 100) {
      return res.status(400).json({ ok: false, error: 'Company too long' });
    }
    if (message.length > 5000) {
      return res.status(400).json({ ok: false, error: 'Message too long' });
    }

    // Configuración SMTP desde variables de entorno
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_TO } = process.env;

    // Debug: mostrar qué variables existen (sin valores)
    console.log('Environment check:', {
      SMTP_HOST: !!SMTP_HOST,
      SMTP_PORT: !!SMTP_PORT,
      SMTP_USER: !!SMTP_USER,
      SMTP_PASS: !!SMTP_PASS,
      MAIL_TO: !!MAIL_TO,
      allEnv: Object.keys(process.env).filter(k => k.startsWith('SMTP') || k === 'MAIL_TO')
    });

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !MAIL_TO) {
      console.error('Missing SMTP configuration');
      return res.status(500).json({ ok: false, error: 'Server configuration error' });
    }

    // Crear transporte de nodemailer
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT, 10),
      secure: true, // Puerto 465 con SSL
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });

    // Preparar datos para el correo
    const fecha = new Date().toLocaleString('es-ES', {
      timeZone: 'Europe/Madrid',
      dateStyle: 'full',
      timeStyle: 'short'
    });

    const topicText = topic || '(no especificado)';
    const companyText = company || '(no especificado)';

    // Cuerpo del correo en texto plano
    const textBody = `
NUEVO CONTACTO DESDE LA WEB

Nombre: ${name}
Email: ${email}
Empresa: ${companyText}
Tema: ${topicText}

Mensaje:
${message}

---
Fecha: ${fecha}
Origen: https://aneker.es
    `.trim();

    // Cuerpo del correo en HTML
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    h2 { color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; }
    .field { margin-bottom: 16px; }
    .label { font-weight: 600; color: #555; font-size: 14px; }
    .value { margin-top: 4px; }
    .message { background: #f4f5f7; padding: 16px; border-radius: 8px; white-space: pre-wrap; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 13px; color: #666; }
  </style>
</head>
<body>
  <h2>Nuevo contacto desde la web</h2>

  <div class="field">
    <div class="label">Nombre</div>
    <div class="value">${escapeHtml(name)}</div>
  </div>

  <div class="field">
    <div class="label">Email</div>
    <div class="value"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div>
  </div>

  <div class="field">
    <div class="label">Empresa</div>
    <div class="value">${escapeHtml(companyText)}</div>
  </div>

  <div class="field">
    <div class="label">Tema de interés</div>
    <div class="value">${escapeHtml(topicText)}</div>
  </div>

  <div class="field">
    <div class="label">Mensaje</div>
    <div class="value message">${escapeHtml(message)}</div>
  </div>

  <div class="footer">
    <strong>Fecha:</strong> ${escapeHtml(fecha)}<br>
    <strong>Origen:</strong> <a href="https://aneker.es">aneker.es</a>
  </div>
</body>
</html>
    `.trim();

    // Correo de confirmación automático al visitante (HTML corporativo)
    const confirmacionHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F4F5F7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F4F5F7; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(20, 32, 58, 0.08);">

          <!-- Header con logo -->
          <tr>
            <td style="background-color: #14203A; padding: 48px 40px; text-align: center;">
              <div style="font-family: Arial, sans-serif; font-size: 44px; font-weight: bold; color: #FFFFFF; line-height: 1.2;">
                <span style="color: #FFFFFF;">ane</span><span style="color: #FF6B52;">k</span><span style="color: #FFFFFF;">er</span>
              </div>
              <div style="margin-top: 16px; font-size: 15px; color: #FFFFFF;">
                Otra mirada. Mejores resultados.
              </div>
            </td>
          </tr>

          <!-- Contenido -->
          <tr>
            <td style="padding: 48px 40px;">
              <h1 style="margin: 0 0 24px; font-size: 28px; font-weight: 700; color: #14203A; line-height: 1.2;">
                Hemos recibido tu mensaje
              </h1>

              <p style="margin: 0 0 16px; font-size: 17px; line-height: 1.6; color: #2E3A50;">
                Hola <strong>${escapeHtml(name)}</strong>,
              </p>

              <p style="margin: 0 0 16px; font-size: 17px; line-height: 1.6; color: #2E3A50;">
                Gracias por contactar con Aneker. Hemos recibido tu solicitud y <strong>te responderemos en menos de 24 horas laborables</strong>.
              </p>

              <p style="margin: 0 0 24px; font-size: 17px; line-height: 1.6; color: #2E3A50;">
                Mientras tanto, si necesitas algo urgente, puedes escribirnos directamente a <a href="mailto:hola@aneker.es" style="color: #C23B22; text-decoration: none; font-weight: 600;">hola@aneker.es</a> o agendar una reunión desde nuestra web.
              </p>

              <!-- Resumen de lo enviado -->
              <div style="background-color: #F4F5F7; border-radius: 12px; padding: 24px; margin: 32px 0;">
                <div style="font-size: 14px; font-weight: 600; color: #5E6B80; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.05em;">
                  Resumen de tu consulta
                </div>
                <div style="font-size: 15px; color: #2E3A50; line-height: 1.6;">
                  <div style="margin-bottom: 8px;">
                    <strong>Tema:</strong> ${escapeHtml(topicText)}
                  </div>
                  <div style="margin-bottom: 8px;">
                    <strong>Mensaje:</strong>
                  </div>
                  <div style="padding: 12px; background-color: #FFFFFF; border-radius: 8px; white-space: pre-wrap; font-size: 15px;">
${escapeHtml(message.substring(0, 200))}${message.length > 200 ? '...' : ''}
                  </div>
                </div>
              </div>

              <p style="margin: 32px 0 0; font-size: 15px; line-height: 1.6; color: #5E6B80;">
                Un saludo,<br>
                <strong style="color: #14203A;">El equipo de Aneker</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F4F5F7; padding: 32px 40px; text-align: center; border-top: 1px solid #D9DEE6;">
              <p style="margin: 0 0 12px; font-size: 14px; color: #5E6B80;">
                <a href="https://aneker.es" style="color: #C23B22; text-decoration: none; font-weight: 600;">aneker.es</a> ·
                <a href="https://www.linkedin.com/company/aneker" style="color: #5E6B80; text-decoration: none;">LinkedIn</a>
              </p>
              <p style="margin: 0; font-size: 13px; color: #97A3B6;">
                Este correo es una confirmación automática. Por favor, no respondas a este mensaje.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    const confirmacionTexto = `
Hola ${name},

Gracias por contactar con Aneker. Hemos recibido tu solicitud y te responderemos en menos de 24 horas laborables.

Mientras tanto, si necesitas algo urgente, puedes escribirnos directamente a hola@aneker.es o agendar una reunión desde nuestra web.

RESUMEN DE TU CONSULTA
-----------------------
Tema: ${topicText}
Mensaje: ${message.substring(0, 200)}${message.length > 200 ? '...' : ''}

Un saludo,
El equipo de Aneker

---
aneker.es
Este correo es una confirmación automática. Por favor, no respondas a este mensaje.
    `.trim();

    // Enviar AMBOS correos en paralelo
    await Promise.all([
      // 1. Correo interno al equipo
      transporter.sendMail({
        from: `"Web Aneker" <${SMTP_USER}>`,
        to: MAIL_TO,
        replyTo: email,
        subject: `Contacto web: ${name}`,
        text: textBody,
        html: htmlBody
      }),

      // 2. Confirmación automática al visitante
      transporter.sendMail({
        from: `"Aneker" <${SMTP_USER}>`,
        to: email,
        subject: 'Hemos recibido tu mensaje',
        text: confirmacionTexto,
        html: confirmacionHTML
      })
    ]);

    // Respuesta exitosa
    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error('Error sending email:', error);
    // No revelar detalles del error SMTP
    return res.status(500).json({ ok: false, error: 'Failed to send message' });
  }
};
