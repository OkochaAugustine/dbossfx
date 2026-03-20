import { NextResponse } from "next/server";
import connectToMongo from "@/lib/mongodb";
import User from "@/models/User";
import AccountStatement from "@/models/AccountStatement";

export async function GET() {
  try {
    await connectToMongo();

    // Get all users
    const users = await User.find().lean();

    // Get all account statements
    const accounts = await AccountStatement.find().lean();

    // Map accounts by user_id for quick lookup
    const accountMap = {};
    accounts.forEach(acc => {
      accountMap[acc.user_id] = acc;
    });

    // Combine user + account data
    const formattedUsers = users.map(u => {
      const acc = accountMap[u._id?.toString()] || {};

      return {
        user_id: u._id?.toString(),
        full_name: u.full_name || "No Name",
        email: u.email,
        phone: u.phone || "",
        account_id: acc._id || null,
        balance: acc.balance || 0,
        earned_profit: acc.earned_profit || 0,
        active_deposit: acc.active_deposit || 0,
        created_at: u.createdAt || new Date(),
      };
    });

    // Sort newest first
    formattedUsers.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    return NextResponse.json({
      success: true,
      data: formattedUsers,
    });

  } catch (error) {
    console.error("Admin Users API Error:", error);

    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}