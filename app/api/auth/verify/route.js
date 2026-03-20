import { NextResponse } from "next/server";
import connectToMongo from "@/lib/mongodb";
import User from "@/models/User";
import AccountStatement from "@/models/AccountStatement";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/mailer";

export async function POST(req) {
  try {
    const { fullName, email, phone, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password required" },
        { status: 400 }
      );
    }

    await connectToMongo();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ CREATE TOKEN
    const token = crypto.randomBytes(32).toString("hex");

    const newUser = await User.create({
      full_name: fullName || "Unknown",
      email,
      phone: phone || "",
      password: hashedPassword,
      verification_token: token,
      verification_expires: Date.now() + 1000 * 60 * 60 * 24, // 24h
      is_verified: false,
    });

    await AccountStatement.create({
      user_id: newUser._id.toString(),
      balance: 0,
      earned_profit: 0,
      active_deposit: 0,
    });

    // ✅ SEND EMAIL
    await sendVerificationEmail(email, token);

    return NextResponse.json({
      success: true,
      message: "Registration successful. Check your email to verify.",
    });

  } catch (err) {
    console.error("❌ REGISTER ERROR:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}