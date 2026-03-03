export const runtime = "nodejs";

import { getSupabaseServer } from "@/lib/supabaseServer";

export async function POST(req) {
  try {
    const { fullName, email, phone, password } = await req.json();

    // ✅ Validate required fields
    if (!fullName || !email || !password || !phone) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = getSupabaseServer();

    // 1️⃣ Create Auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email`,
      },
    });

    if (authError || !authData.user) {
      return new Response(
        JSON.stringify({ error: "Auth creation failed: " + (authError?.message || "No user returned") }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const userId = authData.user.id;

    // 2️⃣ Insert into public.users
    const { error: profileError } = await supabase
      .from("users")
      .insert({ id: userId, full_name: fullName, email, phone });

    if (profileError) {
      // Rollback Auth user if DB insert fails
      await supabase.auth.admin.deleteUser(userId);
      return new Response(
        JSON.stringify({ error: "Profile insert failed: " + profileError.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3️⃣ Insert into account_statements
    const { error: accountError } = await supabase
      .from("account_statements")
      .insert({ user_id: userId, balance: 0, earned_profit: 0, active_deposit: 0 });

    if (accountError) {
      // Rollback both Auth and user profile
      await supabase.from("users").delete().eq("id", userId);
      await supabase.auth.admin.deleteUser(userId);
      return new Response(
        JSON.stringify({ error: "Account creation failed: " + accountError.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // ✅ Success response
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