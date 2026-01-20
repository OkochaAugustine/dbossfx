// Force Node runtime
export const runtime = "nodejs";

import { getSupabaseServer } from "@/lib/supabaseServer";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const supabaseServer = getSupabaseServer();

    const { data, error } = await supabaseServer.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ message: "Login successful", user: data.user });
  } catch (err) {
    console.error("Login Error:", err);
    return Response.json(
      { error: "Server error: " + err.message },
      { status: 500 }
    );
  }
}
