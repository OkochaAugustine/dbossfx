// app/api/withdraw/route.js
import connectToMongo from "@/lib/mongodb";
import AccountStatement from "@/models/AccountStatement";

export async function POST(req) {
  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectToMongo();

    // Fetch account
    const account = await AccountStatement.findOne({ user_id });

    if (!account) {
      return new Response(
        JSON.stringify({ error: "Account not found" }),
        { status: 404 }
      );
    }

    // KYC check
    if (!account.kyc_verified) {
      return new Response(
        JSON.stringify({ error: "KYC not verified" }),
        { status: 400 }
      );
    }

    // Balance check
    if (Number(account.balance) < 500) {
      return new Response(
        JSON.stringify({ error: "Minimum balance $500 required" }),
        { status: 400 }
      );
    }

    // Simulate withdrawal delay
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Response
    return new Response(
      JSON.stringify({
        message: "Timeout. Talk with our virtual assistance for help.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (err) {
    console.error("Withdraw API Error:", err);

    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}