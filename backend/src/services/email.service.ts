import { IContact } from "../models/contact.model";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    // TODO: Implement actual email sending using nodemailer or similar
    console.log("📧 Email would be sent to:", options.to);
    console.log("Subject:", options.subject);

    // For now, just log the email
    // In production, use nodemailer, SendGrid, AWS SES, etc.

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

export const sendContactNotification = async (
  contact: IContact,
): Promise<boolean> => {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { background: #f8fafc; padding: 20px; margin: 20px 0; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #0f172a; }
        .value { color: #475569; margin-top: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🥋 New Contact Form Submission</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Name:</div>
            <div class="value">${contact.name}</div>
          </div>
          <div class="field">
            <div class="label">Email:</div>
            <div class="value">${contact.email}</div>
          </div>
          ${
            contact.company
              ? `
          <div class="field">
            <div class="label">Company:</div>
            <div class="value">${contact.company}</div>
          </div>
          `
              : ""
          }
          <div class="field">
            <div class="label">Budget:</div>
            <div class="value">${contact.budget}</div>
          </div>
          <div class="field">
            <div class="label">Project Type:</div>
            <div class="value">${contact.project}</div>
          </div>
          <div class="field">
            <div class="label">Message:</div>
            <div class="value">${contact.message}</div>
          </div>
          <div class="field">
            <div class="label">Submitted:</div>
            <div class="value">${new Date(contact.createdAt).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: process.env.ADMIN_EMAIL || "admin@martialdev.com",
    subject: `New Contact: ${contact.name} - ${contact.project}`,
    html: emailHtml,
  });
};
