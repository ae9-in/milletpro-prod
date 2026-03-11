import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter = null;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  if (!env.emailUser || !env.emailPass) {
    console.warn("[EmailService] Email credentials missing. Emails will not be sent.");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: env.emailHost,
    port: env.emailPort,
    secure: env.emailSecure,
    auth: {
      user: env.emailUser,
      pass: env.emailPass,
    },
  });

  return transporter;
}

function formatCurrency(value) {
  return `Rs. ${Number(value || 0).toFixed(2)}`;
}

function buildItemsRows(items) {
  return items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #f0ebe3; font-size: 14px; color: #3d2c1e;">
          ${item.name || "Product"}
          ${item.weight ? `<span style="color: #8c7355; font-size: 12px;"> (${item.weight})</span>` : ""}
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #f0ebe3; text-align: center; font-size: 14px; color: #3d2c1e;">
          ${item.quantity || 1}
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #f0ebe3; text-align: right; font-size: 14px; color: #3d2c1e;">
          ${formatCurrency((item.price || 0) * (item.quantity || 1))}
        </td>
      </tr>`,
    )
    .join("");
}

function buildAddressHtml(order, user) {
  const name = user.fullName || "Valued Customer";
  const address = order.deliveryAddress || "Address on file";
  const phone = order.phone ? `<br/>Phone: ${order.phone}` : "";

  return `
    <p style="margin: 4px 0; font-size: 14px; color: #5c4a35;">
      ${name}<br/>
      ${address}${phone}
    </p>`;
}

function buildOrderConfirmationHtml(order, user) {
  const formattedDate = new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const orderId = String(order._id).slice(-8).toUpperCase();
  const deliveryCharge = Math.max(0, Number(order.total || 0) - Number(order.subtotal || 0) - Number(order.gst || 0));

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Confirmation - Millet Pro</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fdf8f2; font-family: Georgia, serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fdf8f2; padding: 32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.07);">
          <tr>
            <td style="background: linear-gradient(135deg, #5c3d1e 0%, #8b5e3c 100%); padding: 36px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; letter-spacing: 2px; font-weight: normal;">MILLET PRO</h1>
              <p style="margin: 8px 0 0; color: #f0d9c0; font-size: 13px; letter-spacing: 1px;">NATURAL | HEALTHY | WHOLESOME</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f5ede2; padding: 24px 40px; text-align: center; border-bottom: 2px solid #e8d5b7;">
              <p style="margin: 0; font-size: 22px; color: #5c3d1e;">Order Confirmed</p>
              <p style="margin: 8px 0 0; color: #8c7355; font-size: 14px;">
                Thank you, <strong>${user.fullName || "Valued Customer"}</strong>. Your order has been placed successfully.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size: 13px; color: #8c7355;">
                    <strong style="color: #3d2c1e;">Order ID</strong><br/>
                    <span style="font-family: monospace; color: #5c3d1e;">#${orderId}</span>
                  </td>
                  <td style="font-size: 13px; color: #8c7355; text-align: right;">
                    <strong style="color: #3d2c1e;">Order Date</strong><br/>
                    ${formattedDate}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px 0;">
              <p style="margin: 0 0 12px; font-size: 16px; color: #3d2c1e; font-weight: bold; border-bottom: 2px solid #e8d5b7; padding-bottom: 8px;">
                Order Items
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <thead>
                  <tr style="background-color: #f5ede2;">
                    <th style="padding: 10px 12px; text-align: left; font-size: 12px; color: #8c7355; font-weight: bold; text-transform: uppercase;">Product</th>
                    <th style="padding: 10px 12px; text-align: center; font-size: 12px; color: #8c7355; font-weight: bold; text-transform: uppercase;">Qty</th>
                    <th style="padding: 10px 12px; text-align: right; font-size: 12px; color: #8c7355; font-weight: bold; text-transform: uppercase;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${buildItemsRows(order.items || [])}
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #8c7355;">Subtotal</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #3d2c1e; text-align: right;">${formatCurrency(order.subtotal)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #8c7355;">GST</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #3d2c1e; text-align: right;">${formatCurrency(order.gst)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #8c7355;">Delivery</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #3d2c1e; text-align: right;">
                    ${deliveryCharge === 0 ? '<span style="color: #5a8a5a;">FREE</span>' : formatCurrency(deliveryCharge)}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0 6px; font-size: 16px; color: #3d2c1e; font-weight: bold; border-top: 2px solid #e8d5b7;">Total Paid</td>
                  <td style="padding: 10px 0 6px; font-size: 18px; color: #5c3d1e; font-weight: bold; text-align: right; border-top: 2px solid #e8d5b7;">
                    ${formatCurrency(order.total)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px 0;">
              <p style="margin: 0 0 10px; font-size: 16px; color: #3d2c1e; font-weight: bold; border-bottom: 2px solid #e8d5b7; padding-bottom: 8px;">
                Delivery Address
              </p>
              ${buildAddressHtml(order, user)}
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 40px;">
              <div style="background-color: #f5ede2; border-left: 4px solid #8b5e3c; padding: 14px 16px; border-radius: 4px;">
                <p style="margin: 0; font-size: 13px; color: #5c3d1e;">
                  <strong>Estimated Delivery:</strong> 3-5 business days<br/>
                  <span style="color: #8c7355;">You will receive another update once your order is dispatched.</span>
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #3d2c1e; padding: 24px 40px; text-align: center;">
              <p style="margin: 0 0 8px; color: #f0d9c0; font-size: 13px;">
                Questions? Reply to this email or contact us at
                <a href="mailto:${env.emailFromAddress}" style="color: #d4a96a; text-decoration: none;">${env.emailFromAddress}</a>
              </p>
              <p style="margin: 0; color: #7a6250; font-size: 11px;">&copy; ${new Date().getFullYear()} Millet Pro. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendOrderConfirmationEmail(order, user) {
  const transport = getTransporter();

  if (!transport) {
    console.warn("[EmailService] Skipping email because the transporter is not configured.");
    return { success: false, reason: "not_configured" };
  }

  if (!user?.email) {
    console.warn("[EmailService] Skipping email because the user email is not available.");
    return { success: false, reason: "no_email" };
  }

  const orderId = String(order._id).slice(-8).toUpperCase();

  try {
    const info = await transport.sendMail({
      from: `"${env.emailFromName}" <${env.emailFromAddress}>`,
      to: user.email,
      subject: `Order Confirmed #${orderId} - Millet Pro`,
      html: buildOrderConfirmationHtml(order, user),
      text: [
        `Hi ${user.fullName || "Customer"},`,
        "",
        "Your Millet Pro order has been confirmed.",
        `Order ID: #${orderId}`,
        `Total: ${formatCurrency(order.total)}`,
        "",
        "We will notify you once your order is shipped.",
        "",
        "Thank you for shopping with Millet Pro.",
      ].join("\n"),
    });

    console.log(`[EmailService] Confirmation email sent to ${user.email} | MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown email error";
    console.error(`[EmailService] Failed to send email to ${user.email}: ${message}`);
    return { success: false, reason: "send_error", error: message };
  }
}
