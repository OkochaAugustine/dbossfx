import mongoose from "mongoose";

const AccountStatementSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // same as user _id
  user_id: { type: String, required: true },
  balance: { type: Number, default: 0 },
  earned_profit: { type: Number, default: 0 },
  active_deposit: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.models.AccountStatement || mongoose.model("AccountStatement", AccountStatementSchema);