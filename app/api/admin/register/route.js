import { NextResponse } from "next/server";
import connectToMongo from "@/lib/mongodb";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function POST(req) {
  try {
    console.log("🚀 ADMIN REGISTER CALLED");

    const body = await req.json();
    console.log("📥 BODY:", body);

    const { email, password } = body;

    if (!email || !password) {
      console.log("❌ Missing fields");
      return NextResponse.json(
        { success: false, error: "Email and password required" },
        { status: 400 }
      );
    }

    const allowedEmails = [
      "okochaaugustine158@gmail.com",
      "oeloka527@gmail.com"
    ];

    if (!allowedEmails.includes(email)) {
      console.log("❌ Email not allowed:", email);
      return NextResponse.json(
        { success: false, error: "Email not allowed for admin registration" },
        { status: 403 }
      );
    }

    await connectToMongo();
    console.log("✅ Mongo connected");

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log("❌ Admin already exists");
      return NextResponse.json(
        { success: false, error: "Admin already exists" },
        { status: 400 }
      );
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
      email,
      password_hash,
      is_active: true
    });

    console.log("✅ Admin created:", newAdmin._id);

    const token = jwt.sign(
      { id: newAdmin._id.toString(), email: newAdmin.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const res = NextResponse.json({
      success: true,
      token,
      admin: {
        id: newAdmin._id.toString(),
        email: newAdmin.email
      }
    });

    res.cookies.set("admin_token", token, {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    console.log("✅ RESPONSE SENT");

    return res;

  } catch (err) {
    console.error("❌ REGISTER ERROR:", err);

    return NextResponse.json(
      { success: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}