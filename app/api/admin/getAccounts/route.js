// app/api/admin/getAccounts/route.js
import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    /**
     * 1. Fetch users from public.users (NOT auth.users)
     */
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, email, full_name, phone")
      .order("created_at", { ascending: false });

    if (usersError) throw usersError;

    /**
     * 2. Fetch all account statements
     */
    const { data: accounts, error: accountsError } = await supabase
      .from("account_statements")
      .select("id, user_id, balance, earned_profit, active_deposit");

    if (accountsError) throw accountsError;

    /**
     * 3. Merge users + accounts
     * (account_id is guaranteed to exist now)
     */
    const merged = users.map((user) => {
      const acc = accounts.find((a) => a.user_id === user.id);

      return {
        account_id: acc.id,
        user_id: user.id,
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        balance: acc.balance,
        earned_profit: acc.earned_profit,
        active_deposit: acc.active_deposit,
      };
    });

    return NextResponse.json({ success: true, data: merged });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
