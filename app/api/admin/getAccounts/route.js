// app/api/admin/getAccounts/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import AccountStatement from "@/models/AccountStatement";
import { verifyAdmin } from "@/lib/adminAuth"; // ✅ ADDED

export const runtime = "nodejs";

export async function GET(req) { // ✅ req added
  try {
    // ✅ ADMIN PROTECTION (ONLY ADDITION)
    const admin = verifyAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // connect to MongoDB
    await connectDB();

    // get users
    const users = await User.find({}).lean();

    // get account statements
    const accounts = await AccountStatement.find({}).lean();

    // format data
    const formatted = users.map((u) => {
      const acc = accounts.find(
        (a) => String(a.user_id) === String(u._id)
      );

      return {
        user_id: u._id,
        full_name: u.full_name || "Unknown",
        email: u.email,
        phone: u.phone || "",
        account_id: acc?._id || u._id,
        balance: acc?.balance ?? 0,
        earned_profit: acc?.earned_profit ?? 0,
        active_deposit: acc?.active_deposit ?? 0,
        created_at: u.createdAt || u.created_at,
      };
    });

    // sort newest first
    formatted.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    return NextResponse.json({
      success: true,
      data: formatted,
    });

  } catch (err) {

    console.error("GET ACCOUNTS ERROR:", err);

    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}