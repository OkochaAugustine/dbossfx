import clientPromise from "@/lib/mongodb";
import { sendVerificationEmail } from "@/lib/mailer";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { fullName, email, phone, password } = await req.json();

    if (!fullName || !email || !phone || !password) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("dbossfx_new");

    // 1️⃣ Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Create user
    const userResult = await db.collection("users").insertOne({
      full_name: fullName,
      email,
      phone,
      password: hashedPassword,
      email_verified: false,
      created_at: new Date(),
    });

    const userId = userResult.insertedId;

    // 4️⃣ Create verification token
    const token = crypto.randomBytes(32).toString("hex");

    await db.collection("email_verifications").insertOne({
      user_id: userId,
      token,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // 5️⃣ Send email
    await sendVerificationEmail(email, token);

    return new Response(
      JSON.stringify({ message: "Registration successful. Verify email." }),
      { status: 200 }
    );

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Server error" }), { status: 500 });
  }
}