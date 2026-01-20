// Force Node runtime to access server env vars
export const runtime = "nodejs";

import { getSupabaseServer } from "@/lib/supabaseServer";

export async function POST(req) {
  try {
    const { fullName, email, phone, password } = await req.json();

    // 1️⃣ Validate input
    if (!fullName || !email || !password) {
      return new Response(
        JSON.stringify({ error: "Missing fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2️⃣ Create server-side Supabase client
    const supabaseServer = getSupabaseServer();

    // 3️⃣ Create auth user
    const { data, error } = await supabaseServer.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email`,
      },
    });

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const userId = data.user.id;

    // 4️⃣ Insert user profile into public.users
    const { error: profileError } = await supabaseServer
      .from("users")
      .insert({
        id: userId,
        full_name: fullName,
        email,
        phone,
      });

    if (profileError) {
      return new Response(
        JSON.stringify({ error: "Profile insert failed: " + profileError.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 5️⃣ account_statements created automatically by trigger

    return new Response(
      JSON.stringify({ message: "Registration successful. Check your email." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("Registration Error:", err);
    return new Response(
      JSON.stringify({ error: "Server error: " + err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
