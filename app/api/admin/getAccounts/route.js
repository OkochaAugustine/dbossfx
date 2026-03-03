// /api/admin/getAccounts/route.js
import { getSupabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";

export async function GET(req) {
  console.log("🔥 GET /api/admin/getAccounts called");

  try {
    // 1️⃣ Check env variables
    console.log("SUPABASE_URL exists:", !!process.env.SUPABASE_URL);
    console.log("SUPABASE_SERVICE_ROLE_KEY exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);

    // 2️⃣ Create supabase client
    const supabase = getSupabaseServer();

    if (!supabase) {
      console.log("❌ Supabase client is undefined");
      throw new Error("Supabase server client not initialized");
    }

    console.log("✅ Supabase client created");

    // 3️⃣ Test simple query first
    console.log("📡 Testing basic users query...");
    const { data: testUsers, error: usersError } = await supabase
      .from("users")
      .select("*")
      .limit(5);

    if (usersError) {
      console.log("❌ Users query failed:", usersError);
      throw usersError;
    }
    console.log("✅ Basic users query works");

    // 4️⃣ Now relational query
    console.log("📡 Testing relational query with account_statements...");
    const { data, error } = await supabase
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

    if (error) {
      console.log("❌ Relational query failed:", error);
      throw error;
    }

    console.log("✅ Relational query success");
    console.log("Returned rows:", data?.length);

    // 5️⃣ Format data so frontend can safely use .map()
    const formatted = (data || []).map((user) => {
      const account = user.account_statements?.[0];

      return {
        user_id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        account_id: account?.id || null,
        balance: account?.balance ?? 0,
        earned_profit: account?.earned_profit ?? 0,
        active_deposit: account?.active_deposit ?? 0,
      };
    });

    console.log("✅ Data formatted successfully");

    return new Response(
      JSON.stringify({
        success: true,
        data: formatted, // 🔥 MUST be called "data" for AdminDashboard
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("🚨 FINAL ERROR:", err);

    return new Response(
      JSON.stringify({
        success: false,
        error: err.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}