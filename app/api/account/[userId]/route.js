import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { userId } = params;
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const { data: account, error } = await supabase
      .from("account_statements")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle(); // returns null if no row found

    if (error) throw error;

    if (!account) {
      return NextResponse.json({ message: "No account found", user_id: userId });
    }

    return NextResponse.json({ account });
  } catch (err) {
    console.error("Error fetching account:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
