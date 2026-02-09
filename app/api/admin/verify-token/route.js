import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token = cookies().get("admin_token")?.value;

    if (!token) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    return NextResponse.json({ valid: true, admin: decoded });
  } catch (err) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}
