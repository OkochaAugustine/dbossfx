import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToMongo from "@/lib/mongodb";
import Admin from "@/models/Admin";

export async function GET(req) {
  try {
    const token = req.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

    if (decoded.role !== "admin") {
      return NextResponse.json({ success: false }, { status: 403 });
    }

    await connectToMongo();

    const admin = await Admin.findById(decoded.adminId);

    if (!admin || !admin.is_active) {
      return NextResponse.json({ success: false }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.email
      }
    });

  } catch (err) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
}