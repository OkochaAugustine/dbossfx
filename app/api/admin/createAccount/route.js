import { getSupabaseServer } from "@/lib/supabaseServer";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req) {
  console.log("🔥 POST /api/admin/createAccount called");

  try {
    const body = await req.json();
    console.log("Body:", body);

    const { user_id, balance, earned_profit, active_deposit } = body;

    const supabase = getSupabaseServer();

    // 1️⃣ Verify admin token
    const token = cookies().get("admin_token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: "No authorization token provided" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    if (decoded.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Admins only" },
        { status: 403 }
      );
    }

    // 2️⃣ Check if account already exists
    const { data: existing, error: checkError } = await supabase
      .from("account_statements")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 = no rows found (Supabase error code for .single() no result)
      console.error("❌ Check existing account failed:", checkError);
      return NextResponse.json({ success: false, error: checkError.message }, { status: 400 });
    }

    if (existing) {
      console.log("⚠ Account already exists, updating instead");

      // 3️⃣ Update existing account
      const { data, error } = await supabase
        .from("account_statements")
        .update({
          balance: balance ?? existing.balance,
          earned_profit: earned_profit ?? existing.earned_profit,
          active_deposit: active_deposit ?? existing.active_deposit,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user_id)
        .select()
        .single();

      if (error) {
        console.error("❌ Update failed:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      }

      console.log("✅ Account updated");
      return NextResponse.json({ success: true, account: data }, { status: 200 });
    }

    // 4️⃣ Insert new account
    const { data, error } = await supabase
      .from("account_statements")
      .insert({
        user_id,
        balance: balance ?? 0,
        earned_profit: earned_profit ?? 0,
        active_deposit: active_deposit ?? 0,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("❌ Insert failed:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    console.log("✅ Account created");
    return NextResponse.json({ success: true, account: data }, { status: 200 });
  } catch (err) {
    console.error("🚨 CREATE ACCOUNT ERROR:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}