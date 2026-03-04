// app/api/admin/getAccounts/route.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { getSupabaseServer } from "@/lib/supabaseServer";

export async function GET(req) {
  const supabase = getSupabaseServer();

  try {
    console.log("🔥 GET /api/admin/getAccounts called");

    // 1️⃣ Fetch all users
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("*");

    if (usersError) throw usersError;

    const accountsData = [];

    // 2️⃣ Loop through users and ensure they have an account
    for (const user of users) {
      // Check if the account already exists
      const { data: account, error: accountError } = await supabase
        .from("account_statements")
        .select("*")
        .eq("user_id", user.id)
        .single();

      let finalAccount = account;

      if (accountError && accountError.code === "PGRST116") {
        // Account not found, create default
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
          console.error("❌ Failed to create default account:", createError);
          continue; // skip this user
        }

        finalAccount = newAccount;
        console.log("ℹ Created default account for user", user.id);
      } else if (accountError) {
        console.error("❌ Failed to fetch account for user", user.id, accountError);
        continue; // skip this user
      }

      accountsData.push({
        user_id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        account_id: finalAccount.id,
        balance: finalAccount.balance,
        earned_profit: finalAccount.earned_profit,
        active_deposit: finalAccount.active_deposit,
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