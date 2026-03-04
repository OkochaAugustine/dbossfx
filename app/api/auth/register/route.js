// app/admin/register/route.js

// Force Node runtime to access server env vars
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
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

    // 1️⃣ Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email`,
      },
    });

    if (authError || !authData.user) {
      return new Response(
        JSON.stringify({
          error:
            "Auth creation failed: " + (authError?.message || "No user returned"),
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const userId = authData.user.id;

    // 2️⃣ Insert user profile
    const { error: profileError } = await supabase
      .from("users")
      .insert({ id: userId, full_name: fullName, email, phone });

    if (profileError) {
      // Rollback Auth user if profile fails
      await supabase.auth.admin.deleteUser(userId);
      return new Response(
        JSON.stringify({ error: "Profile insert failed: " + profileError.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3️⃣ Insert account statement
    const { error: accountError } = await supabase
      .from("account_statements")
      .upsert(
        { user_id: userId, balance: 0, earned_profit: 0, active_deposit: 0 },
        { onConflict: "user_id" }
      );

    if (accountError) {
      // Rollback both Auth and profile
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