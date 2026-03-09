import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  const { data, error } = await supabase
    .from("users")
    .select(`
      id,
      full_name,
      email,
      phone,
      created_at,
      account_statements:account_statements (
        id,
        balance,
        earned_profit,
        active_deposit,
        created_at
      )
    `);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  const users = data.map(u => {
    const latest = (u.account_statements && u.account_statements[0]) || {};
    return {
      user_id: u.id,
      full_name: u.full_name || "THUNDER WILL FIRE YOU CHAT YOU ARE A FOOL",
      email: u.email,
      phone: u.phone || "",
      account_id: latest.id || null,
      balance: latest.balance || 0,
      earned_profit: latest.earned_profit || 0,
      active_deposit: latest.active_deposit || 0,
      created_at: u.created_at,
    };
  });

  // Sort newest first
  users.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return NextResponse.json({ success: true, data: users });
}