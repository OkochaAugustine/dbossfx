import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: "User ID required" },
        { status: 400 }
      );
    }

    console.log("Deleting user:", user_id);

    // 1️⃣ Delete account statement
    const { error: accError } = await supabaseAdmin
      .from("account_statements")
      .delete()
      .eq("user_id", user_id);

    if (accError) {
      console.error("Account delete error:", accError);
      throw accError;
    }

    // 2️⃣ Delete support messages
    const { error: msgError } = await supabaseAdmin
      .from("support_messages")
      .delete()
      .eq("user_id", user_id);

    if (msgError) {
      console.error("Message delete error:", msgError);
      throw msgError;
    }

    // 3️⃣ Delete user table record
    const { error: userError } = await supabaseAdmin
      .from("users")
      .delete()
      .eq("id", user_id);

    if (userError) {
      console.error("User table delete error:", userError);
      throw userError;
    }

    // 4️⃣ Delete from Supabase Auth (SAFE TRY)
    try {
      await supabaseAdmin.auth.admin.deleteUser(user_id);
    } catch (authError) {
      console.warn("Auth delete warning:", authError.message);
      // Do not crash if auth delete fails
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("FINAL DELETE ERROR:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}