// app/api/withdraw/route.js
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const { user_id } = await req.json();

    // Fetch account from AccountStatement
    const { data: account, error } = await supabase
      .from("AccountStatement")
      .select("*")
      .eq("user_id", user_id)
      .maybeSingle();

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    if (!account) return new Response(JSON.stringify({ error: "Account not found" }), { status: 404 });

    // KYC check
    if (!account.kyc_verified) {
      return new Response(JSON.stringify({ error: "KYC not verified" }), { status: 400 });
    }

    // Balance check
    if (Number(account.balance) < 500) {
      return new Response(JSON.stringify({ error: "Minimum balance $500 required" }), { status: 400 });
    }

    // Simulate withdrawal (e.g., processing)
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Return success or timeout
    return new Response(JSON.stringify({
      message: "Timeout. Talk with our virtual assistance for help."
    }), { status: 200, headers: { "Content-Type": "application/json" } });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

