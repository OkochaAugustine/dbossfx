// app/api/admin/getAccounts/route.js

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  try {

    const { data: users, error } = await supabase
      .from("users")
      .select(`
        id,
        full_name,
        email,
        phone,
        created_at,
        account_statements (
          id,
          balance,
          earned_profit,
          active_deposit
        )
      `);

    if (error) throw error;

    const formatted = users.map((u) => {
      const acc = u.account_statements?.[0];

      return {
        user_id: u.id,
        full_name: u.full_name || "Unknown",
        email: u.email,
        phone: u.phone || "",
        account_id: acc?.id || u.id,
        balance: acc?.balance ?? 0,
        earned_profit: acc?.earned_profit ?? 0,
        active_deposit: acc?.active_deposit ?? 0,
        created_at: u.created_at
      };
    });

    formatted.sort((a,b)=> new Date(b.created_at) - new Date(a.created_at));

    return NextResponse.json({
      success: true,
      data: formatted
    });

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      { success:false, error:err.message },
      { status:500 }
    );
  }
}