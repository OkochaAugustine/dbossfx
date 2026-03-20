import mongoose from "mongoose";

const SupportMessageSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true }, // ✅ index for fast queries
    sender: { type: String, enum: ["user", "admin"], required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true } // automatically adds createdAt & updatedAt
);

// Compound index to speed up fetching messages for a user in order
SupportMessageSchema.index({ userId: 1, createdAt: 1 });

const SupportMessage =
  mongoose.models.SupportMessage ||
  mongoose.model("SupportMessage", SupportMessageSchema);

export default SupportMessage;