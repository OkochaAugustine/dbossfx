import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const { userId } = await req.json();

    const { data, error } = await supabase
      .from("accounts")
      .insert([{
        user_id: userId,
        balance: 0,
        earned_profit: 0,
        active_deposit: 0,
        trading_account_created: false
      }])
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, data }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
