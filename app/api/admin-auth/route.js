import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const allowedEmails = [
  "okochaaugustine158@gmail.com",
  "anotheradmin@example.com",
];

// In-memory store (email => hashed password)
const adminStore = new Map();

export async function POST(req) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  try {
    const { email, password } = await req.json();

    if (!allowedEmails.includes(email)) {
      return NextResponse.json({ error: "Email not allowed" }, { status: 401 });
    }

    if (!password) {
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }

    // REGISTER
    if (pathname.endsWith("/register")) {
      if (adminStore.has(email)) {
        return NextResponse.json({ error: "Admin already registered" }, { status: 400 });
      }
      const hashed = await bcrypt.hash(password, 10);
      adminStore.set(email, hashed);
      return NextResponse.json({ message: "Admin registered" }, { status: 200 });
    }

    // LOGIN
    if (!adminStore.has(email)) {
      return NextResponse.json({ error: "Admin not registered" }, { status: 400 });
    }

    const hashed = adminStore.get(email);
    const valid = await bcrypt.compare(password, hashed);
    if (!valid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = jwt.sign({ email }, process.env.ADMIN_JWT_SECRET, { expiresIn: "1d" });

    return NextResponse.json({ message: "Login successful", token }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
