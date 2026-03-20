import clientPromise from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const { email, password, fullName, phone } = await req.json();

    const client = await clientPromise;
    const db = client.db();

    const users = db.collection("users");
    const accounts = db.collection("account_statements");

    // 0️⃣ Check if email already exists
    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "Email already registered" }),
        { status: 400 }
      );
    }

    // 1️⃣ Create user
    const userId = uuidv4();

    const newUser = {
      user_id: userId,
      full_name: fullName,
      email,
      phone,
      password,
    };

    const userInsert = await users.insertOne(newUser);

    // 2️⃣ Insert default account statement
    const accountData = {
      user_id: userId,
      balance: 0,
      earned_profit: 0,
      active_deposit: 0,
    };

    const accountInsert = await accounts.insertOne(accountData);

    return new Response(
      JSON.stringify({
        message: "User registered successfully. Please check your email to confirm.",
        user: newUser,
        account: accountData,
      }),
      { status: 200 }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}