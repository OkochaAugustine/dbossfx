import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {

    const token = req.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json({ valid: false });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecretkey"
    );

    return NextResponse.json({
      valid: true,
      admin: decoded,
    });

  } catch (err) {

    console.error("JWT verify failed:", err);

    return NextResponse.json({ valid: false });

  }
}