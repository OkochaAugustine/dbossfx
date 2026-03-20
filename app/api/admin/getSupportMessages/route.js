import { NextResponse } from "next/server";
import connectToMongo from "@/lib/mongodb";
import SupportMessage from "@/models/SupportMessage";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    if (!token) throw new Error("No token");

    jwt.verify(token, process.env.ADMIN_JWT_SECRET);

    await connectToMongo();

    const messages = await SupportMessage.find().lean();
    return NextResponse.json({ success: true, data: messages });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 401 });
  }
}