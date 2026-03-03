// Force Node runtime to access server env vars
export const runtime = "nodejs";

import { getSupabaseServer } from "@/lib/supabaseServer";

export async function POST(req) {
  try {
    const { fullName, email, phone, password } = await req.json();

    if (!fullName || !email || !password) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabaseServer = getSupabaseServer();

    // 1️⃣ Create auth user
    const { data, error } = await supabaseServer.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email`,
      },
    });

    if (error) {
      return new Response(
        JSON.stringify({ error: "Auth creation failed: " + error.message }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const userId = data.user.id;

    // 2️⃣ Insert profile
    const { error: profileError } = await supabaseServer
      .from("users")
      .insert({ id: userId, full_name: fullName, email, phone });

    if (profileError) {
      return new Response(
        JSON.stringify({ error: "Profile insert failed: " + profileError.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3️⃣ Upsert account statement
    const { error: accountError } = await supabaseServer
      .from("account_statements")
      .upsert({ user_id: userId, balance: 0, earned_profit: 0, active_deposit: 0 }, { onConflict: "user_id" });

    if (accountError) {
      return new Response(
        JSON.stringify({ error: "Account creation failed: " + accountError.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Registration successful", user: { id: userId, email } }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("Registration Error:", err);
    return new Response(
      JSON.stringify({ error: "Server error: " + (err?.message || err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}