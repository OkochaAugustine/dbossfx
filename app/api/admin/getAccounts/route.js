// /api/admin/getAccounts/route.js
import { getSupabaseServer } from "@/lib/supabaseServer";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req) {
  console.log("🔥 GET /api/admin/getAccounts called");

  try {
    const supabase = getSupabaseServer();
    if (!supabase) throw new Error("Supabase client not initialized");

    // Fetch all users with account statements
    const { data: users, error: usersError } = await supabase
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

    if (usersError) throw usersError;

    // Ensure each user has at least one account statement
    for (const user of users) {
      if (!user.account_statements || user.account_statements.length === 0) {
        console.log(`ℹ Creating default account for user ${user.id}`);
        const { data: newAccount, error: insertError } = await supabase
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

        if (insertError) {
          console.error(`❌ Failed to create account for user ${user.id}:`, insertError);
          // Make a temporary default object to avoid null crash
          user.account_statements = [{
            id: null,
            balance: 0,
            earned_profit: 0,
            active_deposit: 0
          }];
          continue;
        }

        user.account_statements = [newAccount];
      }
    }

    // Format data safely
    const formatted = users.map((user) => {
      const account = user.account_statements?.[0] || {
        id: null,
        balance: 0,
        earned_profit: 0,
        active_deposit: 0
      };

      return {
        user_id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        account_id: account.id,
        balance: account.balance,
        earned_profit: account.earned_profit,
        active_deposit: account.active_deposit,
      };
    });

    console.log("✅ Data formatted successfully");
    return new Response(
      JSON.stringify({ success: true, data: formatted }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("🚨 FINAL ERROR:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}