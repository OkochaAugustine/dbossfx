import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  try {
    // Fetch users
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("id, full_name, email, phone");

    if (userError) throw userError;

    // Fetch accounts
    const { data: accounts, error: accError } = await supabase
      .from("account_statements")
      .select("*");

    if (accError) throw accError;

    // Merge users and accounts
    const merged = users.map((user) => {
      const acc = accounts.find((a) => a.user_id === user.id) || {};
      return {
        account_id: acc.id || null,
        user_id: user.id,
        full_name: user.full_name || "Unknown",
        email: user.email || "Unknown",
        phone: user.phone || "N/A",
        balance: acc.balance ?? 0,
        earned_profit: acc.earned_profit ?? 0,
        active_deposit: acc.active_deposit ?? 0,
      };
    });

    return new Response(JSON.stringify({ success: true, data: merged }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("getAccounts API error:", err);
    return new Response(JSON.stringify({ success: false, error: err.message || "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
