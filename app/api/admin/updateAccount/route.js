import { supabase } from "@/lib/supabaseClient";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { id, balance, earned_profit, active_deposit } = await req.json();

    // 1️⃣ Get token from cookies
    const token = cookies().get("admin_token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: "No authorization token provided" },
        { status: 401 }
      );
    }

    // 2️⃣ Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    // 3️⃣ Ensure admin role
    if (decoded.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Access denied: Admins only" },
        { status: 403 }
      );
    }

    // 4️⃣ Fetch current account
    const { data: currentData, error: fetchError } = await supabase
      .from("account_statements")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !currentData) {
      return NextResponse.json(
        { success: false, error: fetchError?.message || "Account not found" },
        { status: 400 }
      );
    }

    // 5️⃣ Merge changes safely
    const updatedData = {
      balance: balance ?? currentData.balance,
      earned_profit: earned_profit ?? currentData.earned_profit,
      active_deposit: active_deposit ?? currentData.active_deposit,
      updated_at: new Date().toISOString(),
    };

    // 6️⃣ Update account
    const { data, error } = await supabase
      .from("account_statements")
      .update(updatedData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, account: data }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
