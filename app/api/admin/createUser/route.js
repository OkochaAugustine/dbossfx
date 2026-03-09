import { NextResponse } from "next/server";
import connectToMongo from "@/lib/mongodb";
import User from "@/models/User";
import AccountStatement from "@/models/AccountStatement";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    await connectToMongo();

    const { full_name, email, phone } = await req.json();

    const id = uuidv4(); // generate unique id

    const newUser = await User.create({
      _id: id,
      full_name,
      email,
      phone,
    });

    const newAccount = await AccountStatement.create({
      _id: id,
      user_id: id,
      balance: 0,
      earned_profit: 0,
      active_deposit: 0,
    });

    return NextResponse.json({ success: true, data: { user: newUser, account: newAccount } });
  } catch (err) {
    console.error("POST /admin/createUser error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}