import { connectDB } from "@/lib/mongodb";
import AccountStatement from "@/models/AccountStatement";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req) {
  console.log("🔥 POST /api/admin/updateAccount called");

  try {
    // 1️⃣ Parse body
    let body;
    try {
      body = await req.json();
      console.log("✅ Body parsed:", body);
    } catch (parseError) {
      console.error("❌ Failed to parse JSON body:", parseError);
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { id, balance, earned_profit, active_deposit } = body;

    // 2️⃣ Connect MongoDB
    await connectDB();
    console.log("✅ MongoDB connected");

    // 3️⃣ Get admin token
    const token = cookies().get("admin_token")?.value;
    console.log("Token exists:", !!token);

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No authorization token provided" },
        { status: 401 }
      );
    }

    // 4️⃣ Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
      console.log("✅ JWT verified:", decoded);
    } catch (err) {
      console.error("❌ JWT verification failed:", err);
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    if (decoded.role !== "admin") {
      console.log("❌ User is not admin");
      return NextResponse.json(
        { success: false, error: "Access denied: Admins only" },
        { status: 403 }
      );
    }

    // 5️⃣ Fetch current account
    console.log("📡 Fetching account ID:", id);

    const currentData = await AccountStatement.findById(id);

    if (!currentData) {
      console.error("❌ Account not found");
      return NextResponse.json(
        { success: false, error: "Account not found" },
        { status: 404 }
      );
    }

    console.log("✅ Current account:", currentData);

    // 6️⃣ Prepare update
    const updatedData = {
      balance: balance ?? currentData.balance,
      earned_profit: earned_profit ?? currentData.earned_profit,
      active_deposit: active_deposit ?? currentData.active_deposit,
      updated_at: new Date(),
    };

    console.log("📡 Updating with:", updatedData);

    const updatedAccount = await AccountStatement.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    console.log("✅ Account updated successfully");

    return NextResponse.json(
      { success: true, account: updatedAccount },
      { status: 200 }
    );

  } catch (err) {
    console.error("🚨 FINAL SERVER CRASH:", err);

    return NextResponse.json(
      { success: false, error: err.message || "Unknown server error" },
      { status: 500 }
    );
  }
}