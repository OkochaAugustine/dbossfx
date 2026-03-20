// testAdminAuth.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "./models/Admin.js"; // make sure this path is correct
import dotenv from "dotenv";

dotenv.config();

// 🔹 Use the same secret as your app
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "supersecretkey";

// 🔹 MongoDB URI
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://<user>:<password>@cluster0.mongodb.net/dbossfx?retryWrites=true&w=majority";

async function main() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    // 🔹 Change this to the admin email you created
    const email = "thomasmorgan3020@gmail.com";
    const password = "YOUR_ADMIN_PASSWORD_HERE"; // plaintext password used during creation

    const admin = await Admin.findOne({ email });

    if (!admin) {
      console.error("❌ Admin not found in DB");
      process.exit(1);
    }

    console.log("🔹 Admin fetched from DB:", {
      email: admin.email,
      password_hash: admin.password_hash,
    });

    const valid = await bcrypt.compare(password, admin.password_hash);

    if (!valid) {
      console.error("❌ Password does not match");
      process.exit(1);
    }

    const token = jwt.sign(
      { id: admin._id.toString(), email: admin.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Login successful!");
    console.log("🔑 JWT token:", token);

    process.exit(0);
  } catch (err) {
    console.error("❌ Error during test login:", err);
    process.exit(1);
  }
}

main();