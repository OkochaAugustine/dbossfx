import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // 1️⃣ Find admin
    const { data: admin, error } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !admin) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 2️⃣ Check password
    const match = await bcrypt.compare(password, admin.password_hash);
    if (!match) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 3️⃣ Generate JWT
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: "admin" },
      process.env.ADMIN_JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4️⃣ Set cookie
    const res = NextResponse.json({ success: true, message: "Login successful" });
    res.cookies.set("admin_token", token, {
      httpOnly: true,
      path: "/", // ✅ important for all pages
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

