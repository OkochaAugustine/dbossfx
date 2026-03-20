import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import AccountStatement from "@/models/AccountStatement";
import SupportMessage from "@/models/SupportMessage";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: "User ID required" },
        { status: 400 }
      );
    }

    console.log("Deleting user:", user_id);

    // connect MongoDB
    await connectDB();

    // 1️⃣ Delete account statements
    const accDelete = await AccountStatement.deleteMany({ user_id });

    console.log("Account statements deleted:", accDelete.deletedCount);

    // 2️⃣ Delete support messages
    const msgDelete = await SupportMessage.deleteMany({ user_id });

    console.log("Support messages deleted:", msgDelete.deletedCount);

    // 3️⃣ Delete user record
    const userDelete = await User.findByIdAndDelete(user_id);

    if (!userDelete) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    console.log("User deleted successfully");

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("FINAL DELETE ERROR:", err);

    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}