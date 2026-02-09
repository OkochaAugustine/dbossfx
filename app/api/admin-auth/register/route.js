import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // 1️⃣ Only allow these 2 emails
    const allowedEmails = [
      "okochaaugustine158@gmail.com",
      "oeloka527@gmail.com"
    ];
    if (!allowedEmails.includes(email)) {
      return new Response(
        JSON.stringify({ success: false, error: "Email not allowed for admin registration" }),
        { status: 403 }
      );
    }

    // 2️⃣ Check if admin already exists
    const { data: existingAdmin, error: fetchError } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // Any error except no rows found
      throw fetchError;
    }

    if (existingAdmin) {
      return new Response(
        JSON.stringify({ success: false, error: "Admin already exists" }),
        { status: 400 }
      );
    }

    // 3️⃣ Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // 4️⃣ Insert new admin
    const { data, error: insertError } = await supabase
      .from("admins")
      .insert([{ email, password_hash, is_active: true }])
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return new Response(JSON.stringify({ success: true, admin: { id: data.id, email: data.email } }), {
      status: 200,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || "Unknown error" }),
      { status: 500 }
    );
  }
}
