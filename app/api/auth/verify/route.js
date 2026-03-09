import { getSupabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Missing verification token" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();

    // 1️⃣ Look up token in email_verifications table
    const { data: tokenRow, error: tokenError } = await supabase
      .from("email_verifications")
      .select("*")
      .eq("token", token)
      .single();

    if (tokenError || !tokenRow) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // 2️⃣ Check expiration
    if (new Date(tokenRow.expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, error: "Token has expired" },
        { status: 400 }
      );
    }

    const userId = tokenRow.user_id;

    // 3️⃣ Update Supabase Auth to confirm email
    const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
      email_confirmed: true,
    });

    if (updateError) {
      return NextResponse.json(
        { success: false, error: "Failed to confirm email: " + updateError.message },
        { status: 500 }
      );
    }

    // 4️⃣ Delete verification token
    await supabase.from("email_verifications").delete().eq("token", token);

    return NextResponse.json({
      success: true,
      message: "Email verified successfully! You can now log in.",
    });
  } catch (err) {
    console.error("Email verification error:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}