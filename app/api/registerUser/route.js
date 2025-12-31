import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const { email, password, fullName, phone } = await req.json();

    // 0️⃣ Check if email already exists in auth.users
    const { data: existingAuthUser } = await supabase.auth.admin.listUsers(); // admin API
    if (existingAuthUser.some(u => u.email === email)) {
      return new Response(JSON.stringify({ error: "Email already registered" }), { status: 400 });
    }

    // 1️⃣ Sign up user in Supabase Auth
    const { data: user, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return new Response(JSON.stringify({ error: authError.message }), { status: 400 });
    }

    const userId = user.user.id;

    // 2️⃣ Insert into custom users table (upsert to avoid duplicates)
    const { data: userInsert, error: userInsertError } = await supabase
      .from("users")
      .upsert(
        [{ user_id: userId, full_name: fullName, email, phone }],
        { onConflict: ["user_id"] }
      )
      .select()
      .single();

    if (userInsertError) {
      return new Response(JSON.stringify({ error: userInsertError.message }), { status: 400 });
    }

    // 3️⃣ Insert default account statement (upsert ensures one row per user)
    const { data: accountInsert, error: accountError } = await supabase
      .from("account_statements")
      .upsert(
        [{ user_id: userId, balance: 0, earned_profit: 0, active_deposit: 0 }],
        { onConflict: ["user_id"] }
      )
      .select()
      .single();

    if (accountError) {
      return new Response(JSON.stringify({ error: accountError.message }), { status: 400 });
    }

    return new Response(
      JSON.stringify({
        message: "User registered successfully. Please check your email to confirm.",
        user: userInsert,
        account: accountInsert,
      }),
      { status: 200 }
    );

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
