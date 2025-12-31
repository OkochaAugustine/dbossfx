import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const { fullName, email, phone, password } = await req.json();

    // 1️⃣ Check if email already exists in your custom users table
    const { data: existingUser, error: existingError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingError && existingError.code !== "PGRST116") {
      // PGRST116 = no rows found, ignore
      return new Response(
        JSON.stringify({ error: existingError.message }),
        { status: 500 }
      );
    }

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "Email already registered" }),
        { status: 400 }
      );
    }

    // 2️⃣ Sign up user in Supabase Auth
    const { data: userData, error: authError } = await supabase.auth.signUp(
      { email, password },
      { redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email` }
    );

    if (authError) {
      return new Response(
        JSON.stringify({ error: authError.message }),
        { status: 400 }
      );
    }

    const userId = userData.user.id;

    // 3️⃣ Insert into your custom users table
    const { data: userInsert, error: userInsertError } = await supabase
      .from("users")
      .insert([{ id: userId, full_name: fullName, email, phone }])
      .select()
      .single();

    if (userInsertError) {
      return new Response(
        JSON.stringify({ error: userInsertError.message }),
        { status: 400 }
      );
    }

    // 4️⃣ account_statements is auto-created via trigger
    // ✅ This ensures account_id exists for the admin dashboard immediately

    return new Response(
      JSON.stringify({
        message:
          "User registered successfully. Please check your email to confirm.",
        user: userInsert,
      }),
      { status: 200 }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}
