// createTestUser.js
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import User from "./models/User.js";
import AccountStatement from "./models/AccountStatement.js";

// ⚡ Directly put your MongoDB URI here
const MONGO_URI = "mongodb+srv://okochaaugustine158_db_user:cuo9LEZIHN78lan5@dbossfx.mctenw6.mongodb.net/dbossfx?retryWrites=true&w=majority";

async function main() {
  try {
    // ✅ Remove options, just pass the URI
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const id = uuidv4();

    // 1️⃣ Create a user
    const newUser = await User.create({
      _id: id,
      full_name: "John Doe",
      email: "john@example.com",
      phone: "08012345678",
    });

    // 2️⃣ Create account statement
    const newAccount = await AccountStatement.create({
      _id: id, // same as user ID
      user_id: id,
      balance: 0,
      earned_profit: 0,
      active_deposit: 0,
    });

    console.log("✅ User and account created:", { newUser, newAccount });
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating user:", err);
    process.exit(1);
  }
}

main();