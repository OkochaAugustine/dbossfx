// Force Node runtime
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import connectToMongo from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    console.log("📥 Login attempt:", email);

    /* =========================
       VALIDATE INPUT
    ========================== */

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    /* =========================
       CONNECT MONGODB
    ========================== */

    await connectToMongo();
    console.log("✅ MongoDB connected");

    /* =========================
       FIND USER
    ========================== */

    const user = await User.findOne({ email });

    console.log("🔎 User found:", user ? user.email : "None");

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    /* =========================
       CHECK PASSWORD
    ========================== */

    const passwordMatch = await bcrypt.compare(password, user.password);

    console.log("🔑 Password match:", passwordMatch);

    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    /* =========================
       SUCCESS RESPONSE
    ========================== */

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id.toString(),
        full_name: user.full_name,
        email: user.email,
        role: user.role || "user",
      },
    });

    /* =========================
       SET USER COOKIE
    ========================== */

    response.cookies.set("userId", user._id.toString(), {
      httpOnly: false, // frontend can read it
      secure: false,   // set true in production
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;

  } catch (err) {
    console.error("❌ Login Error:", err);

    return NextResponse.json(
      { success: false, error: "Server error: " + err.message },
      { status: 500 }
    );
  }
}