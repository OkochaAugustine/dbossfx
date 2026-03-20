// app/api/auth/verify-email/route.js
import { NextResponse } from "next/server";
import connectToMongo from "@/lib/mongodb";
import User from "@/models/User";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    console.log("🚀 VERIFY EMAIL API CALLED");

    const { token } = await req.json();
    console.log("🔑 TOKEN RECEIVED:", token);

    if (!token) {
      console.log("❌ NO TOKEN PROVIDED");
      return NextResponse.json(
        { success: false, error: "No token provided" },
        { status: 400 }
      );
    }

    await connectToMongo();
    console.log("✅ Connected to MongoDB");

    // ✅ FIND USER WITH TOKEN
    const user = await User.findOne({ verification_token: token });

    if (!user) {
      console.log("❌ TOKEN INVALID OR EXPIRED");
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // ✅ CHECK TOKEN EXPIRATION
    if (Date.now() > user.verification_expires) {
      console.log("❌ TOKEN EXPIRED");
      return NextResponse.json(
        { success: false, error: "Token expired" },
        { status: 400 }
      );
    }

    // ✅ VERIFY USER
    if (user.is_verified) {
      console.log("ℹ️ USER ALREADY VERIFIED");
      return NextResponse.json({
        success: true,
        message: "Email already verified",
      });
    }

    user.is_verified = true;
    user.verification_token = null;
    user.verification_expires = null;
    await user.save();

    console.log("✅ USER VERIFIED:", user._id);

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (err) {
    console.error("❌ VERIFY ERROR:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}