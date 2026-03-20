import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "@/models/Admin";
import connectToMongo from "@/lib/mongodb";

export async function POST(req) {
  try {
    await connectToMongo();

    const { email, password } = await req.json();

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    // ✅ INCLUDE ROLE
    const token = jwt.sign(
      { adminId: admin._id, role: "admin" },
      process.env.ADMIN_JWT_SECRET,
      { expiresIn: "8h" }
    );

    const res = NextResponse.json({ success: true });

    // ✅ USE ONE COOKIE NAME ONLY
    res.cookies.set("admin_token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 8,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res;

  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}