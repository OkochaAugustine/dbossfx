import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // use UUID
  full_name: { type: String, default: "Unknown" },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: "" },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);