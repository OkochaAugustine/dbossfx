// app/api/mailer/route.js

import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { email, token } = await req.json();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verifyUrl = `https://dbossfx.com/api/auth/verify?token=${token}`;

    await transporter.sendMail({
      from: `DbossFX <no-reply@dbossfx.com>`,
      to: email,
      subject: "Verify your DbossFX account",
      html: `
        <h2>Welcome to DbossFX</h2>
        <p>Please verify your email by clicking the button below.</p>

        <a href="${verifyUrl}" 
           style="padding:12px 20px;background:#2563eb;color:white;text-decoration:none;border-radius:6px;">
           Verify Email
        </a>

        <p>This link expires in 24 hours.</p>
      `,
    });

    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      { status: 200 }
    );

  } catch (err) {
    console.error("Mailer error:", err);

    return new Response(
      JSON.stringify({ error: "Failed to send email" }),
      { status: 500 }
    );
  }
}