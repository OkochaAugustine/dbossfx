import { getSupabaseServer } from "@/lib/supabaseServer";

export async function POST(req) {
  try {
    const { fullName, email, phone, password } = await req.json();

    if (!fullName || !email || !password) {
      return Response.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // ✅ Create Supabase client at runtime (NOT at import time)
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
      return Response.json(
        { error: error.message },
        { status: 400 }
      );
    }

    const userId = data.user.id;

    // 2️⃣ Insert into public.users
    const { error: profileError } = await supabaseServer
      .from("users")
      .insert({
        id: userId,
        full_name: fullName,
        email,
        phone,
      });

    if (profileError) {
      return Response.json(
        { error: "Profile insert failed: " + profileError.message },
        { status: 500 }
      );
    }

    // 3️⃣ account_statements is created by trigger ✅

    return Response.json({
      message: "Registration successful. Check your email.",
    });

  } catch (err) {
    return Response.json(
      { error: "Server error: " + err.message },
      { status: 500 }
    );
  }
}
