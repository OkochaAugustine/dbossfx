// app/api/admin/getAccounts/route.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { getSupabaseServer } from "@/lib/supabaseServer";

export async function GET(req) {
  const supabase = getSupabaseServer();

  try {
    console.log("🔥 GET /api/admin/getAccounts called");

    // 1️⃣ Fetch all users with their account_statements (LEFT JOIN style)
    const { data: users, error } = await supabase
      .from("users")
      .select(`
        id,
        full_name,
        email,
        phone,
        account_statements (
          id,
          balance,
          earned_profit,
          active_deposit
        )
      `)
      .order("created_at", { ascending: true });

    if (error) throw error;

    // 2️⃣ Ensure all users have an account_statements record
    const accountsData = [];

    for (const user of users) {
      let account = user.account_statements;

      if (!account) {
        // Account missing, create default
        const { data: newAccount, error: createError } = await supabase
          .from("account_statements")
          .insert({
            user_id: user.id,
            balance: 0,
            earned_profit: 0,
            active_deposit: 0,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (createError) {
          console.error("❌ Failed to create default account for user", user.id, createError);
          // Use fallback zero account instead of skipping
          account = { id: null, balance: 0, earned_profit: 0, active_deposit: 0 };
        } else {
          account = newAccount;
          console.log("ℹ Created default account for user", user.id);
        }
      }

      accountsData.push({
        user_id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        account_id: account.id,
        balance: account.balance,
        earned_profit: account.earned_profit,
        active_deposit: account.active_deposit,
      });
    }

    // ✅ Success response
    return new Response(
      JSON.stringify({ success: true, data: accountsData }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("🚨 Error fetching accounts", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message || err }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}