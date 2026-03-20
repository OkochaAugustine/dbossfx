import { NextResponse } from "next/server";
import connectToMongo from "@/lib/mongodb";
import AccountStatement from "@/models/AccountStatement";

export const runtime = "nodejs";

export async function GET(req, { params }) {
  try {

    console.log("🔵 /api/account route called");

    const { userId } = params;

    console.log("🔵 userId received:", userId);

    if (!userId) {
      console.warn("⚠️ userId missing");
      return NextResponse.json(
        { success: false, error: "Missing userId" },
        { status: 400 }
      );
    }

    console.log("🔵 Connecting to MongoDB...");
    await connectToMongo();
    console.log("✅ MongoDB connected");

    console.log("🔵 Searching account with user_id:", userId);

    let account = await AccountStatement.findOne({ user_id: userId }).lean();

    console.log("🔵 Account found in DB:", account);

    // ⚡ If missing, create asynchronously
    if (!account) {

      console.warn("⚠️ No account found for user:", userId);

      setImmediate(async () => {
        try {
          await AccountStatement.create({ user_id: userId });
          console.log("⚡ New account created for user:", userId);
        } catch (err) {
          console.error("❌ Failed to create account:", err);
        }
      });

      account = {
        balance: 0,
        earned_profit: 0,
        active_deposit: 0
      };

      console.log("🔵 Returning default account object:", account);

    } else {

      console.log("🟢 Account balance:", account.balance);
      console.log("🟢 Earned profit:", account.earned_profit);
      console.log("🟢 Active deposit:", account.active_deposit);

    }

    const response = {
      success: true,
      account
    };

    console.log("📦 API response sent to frontend:", response);

    return NextResponse.json(response);

  } catch (err) {

    console.error("❌ Account API error:", err);

    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );

  }
}