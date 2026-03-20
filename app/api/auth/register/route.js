// app/api/auth/register/route.js
import connectToMongo from "@/lib/mongodb";
import User from "@/models/User";
import EmailVerification from "@/models/EmailVerification";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    console.log("🚀 REGISTER API CALLED");

    const { fullName, email, phone, password } = await req.json();

    if (!email || !password) {
      console.log("❌ Missing email or password");
      return new Response(
        JSON.stringify({ success: false, error: "Email and password required" }),
        { status: 400 }
      );
    }

    await connectToMongo();
    console.log("✅ Connected to MongoDB");

    // 1️⃣ Create user
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      full_name: fullName,
      email,
      phone,
      password: hashedPassword,
      is_verified: false,
    });

    console.log("✅ USER CREATED:", user._id);

    // 2️⃣ Generate verification token
    const token = crypto.randomBytes(32).toString("hex");
    console.log("🔑 GENERATED TOKEN:", token);

    // 3️⃣ Save token
    const savedToken = await EmailVerification.create({
      userId: user._id,
      token,
      createdAt: new Date(),
    });

    console.log("✅ TOKEN SAVED:", savedToken);

    // 4️⃣ Attempt to send email, but don't fail registration
    const verifyLink = `https://www.dbossfx.com/verify-email?token=${token}`;
    console.log("📧 VERIFY LINK:", verifyLink);

    try {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify your DbossFX email",
        html: `
          <p>Hi ${fullName},</p>
          <p>Click the link below to verify your email:</p>
          <a href="${verifyLink}">${verifyLink}</a>
        `,
      });

      console.log("✅ EMAIL SENT SUCCESSFULLY");
    } catch (err) {
      console.error("⚠️ Failed to send verification email:", err.message);
      console.log(
        "📌 You can manually use this verification link:",
        verifyLink
      );
    }

    // ✅ Return friendly success message regardless of email sending
    return new Response(
      JSON.stringify({
        success: true,
        message:
          "🎉 Thank you for joining! Please check your email and click the verification link we sent you.",
      }),
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ REGISTER ERROR:", err);

    return new Response(
      JSON.stringify({
        success: false,
        error: err.message || "Server error",
      }),
      { status: 500 }
    );
  }
}