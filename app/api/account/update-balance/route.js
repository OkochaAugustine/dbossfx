import { NextResponse } from "next/server";
import connectToMongo from "@/lib/mongodb";
import AccountStatement from "@/models/AccountStatement";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { userId, profit } = await req.json();

    if (!userId || profit === undefined) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    await connectToMongo();

    const account = await AccountStatement.findOne({ user_id: userId });
    if (!account) return NextResponse.json({ success: false, error: "Account not found" }, { status: 404 });

    account.balance += profit;
    await account.save();

    return NextResponse.json({ success: true, balance: account.balance });
  } catch (err) {
    console.error("❌ Update Balance error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}