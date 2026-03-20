import mongoose from "mongoose";

const EmailVerificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24, // ⏱️ 24 hours auto-delete
  },
});

export default mongoose.models.EmailVerification ||
  mongoose.model("EmailVerification", EmailVerificationSchema);