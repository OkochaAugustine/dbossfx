import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const { id, balance, earned_profit, active_deposit } = await req.json();
    console.log("🚀 Update request payload:", { id, balance, earned_profit, active_deposit });

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: "Account ID is required" }),
        { status: 400 }
      );
    }

    // 1️⃣ Fetch current account
    const { data: currentData, error: fetchError } = await supabase
      .from("account_statements")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !currentData) {
      return new Response(
        JSON.stringify({ success: false, error: fetchError?.message || "Account not found" }),
        { status: 400 }
      );
    }

    // 2️⃣ Merge admin changes safely
    const updatedData = {
      balance: balance !== undefined && balance !== null ? Number(balance) : currentData.balance,
      earned_profit:
        earned_profit !== undefined && earned_profit !== null
          ? Number(earned_profit)
          : currentData.earned_profit,
      active_deposit:
        active_deposit !== undefined && active_deposit !== null
          ? Number(active_deposit)
          : currentData.active_deposit,
      updated_at: new Date().toISOString(), // trigger Realtime
    };

    // 3️⃣ Update account
    const { data, error } = await supabase
      .from("account_statements")
      .update(updatedData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 400 }
      );
    }

    console.log("✅ Account updated successfully:", data);

    return new Response(JSON.stringify({ success: true, account: data }), { status: 200 });
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message || "Unknown error" }),
      { status: 500 }
    );
  }
}
