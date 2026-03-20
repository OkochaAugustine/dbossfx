import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(toEmail, token) {
  // Encode token safely
  const tokenEncoded = encodeURIComponent(token);

  // Frontend verification page URL
  const verifyUrl = `https://www.dbossfx.com/verify-email?token=${tokenEncoded}`;

  const mailOptions = {
    from: `DbossFX <no-reply@dbossfx.com>`,
    to: toEmail,
    subject: "Verify your DbossFX account",
    html: `
      <h2>Welcome to DbossFX</h2>
      <p>Please verify your email by clicking the button below:</p>
      <a href="${verifyUrl}" 
         style="padding:12px 20px;background:#2563eb;color:white;text-decoration:none;border-radius:6px;display:inline-block;">
         Verify Email
      </a>
      <p>If the button does not work, copy and paste this URL into your browser:</p>
      <p>${verifyUrl}</p>
      <p>This link expires in 24 hours.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("📧 Verification email sent:", verifyUrl);
  } catch (err) {
    console.error("⚠️ Failed to send verification email:", err);
    throw new Error("Failed to send verification email");
  }
}