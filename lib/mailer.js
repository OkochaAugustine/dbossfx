import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,   // your Gmail/app password
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(toEmail, token) {
  // ✅ Use your actual site URL here
   const verifyUrl = `https://dbossfx.com/?token=${token}`;

  const mailOptions = {
    from: `DbossFX <no-reply@dbossfx.com>`, // your site name, not Gmail
    to: toEmail,
    subject: "Verify your DbossFX account",
    html: `
      <p>Hello,</p>
      <p>Click the link below to verify your DbossFX account:</p>
      <a href="${verifyUrl}">Verify Email</a>
      <p>This link expires in 24 hours.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}