// app/api/admin/verify-token/route.js
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    console.log("TOKEN FROM COOKIE:", token);

    if (!token) {
      console.log("No token found in cookies");
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
      console.log("TOKEN DECODED:", decoded);
    } catch (err) {
      console.log("JWT VERIFY FAILED:", err.message);
      return NextResponse.json({ valid: false, error: err.message }, { status: 401 });
    }

    return NextResponse.json({ valid: true, admin: decoded });
  } catch (err) {
    console.log("VERIFY TOKEN ERROR:", err.message);
    return NextResponse.json({ valid: false, error: err.message }, { status: 500 });
  }
}
