import mongoose from "mongoose";

async function testConnection() {
  try {
    await mongoose.connect(
      "mongodb+srv://okochaaugustine158_db_user:WjhwykSNTMhJb6Fz@cluster0.36idgls.mongodb.net/dbossfx_new?retryWrites=true&w=majority"
    );
    console.log("✅ Connected to MongoDB!");
  } catch (err) {
    console.error("❌ MongoDB connection FAILED");
    console.error(err);
  }
}

testConnection();