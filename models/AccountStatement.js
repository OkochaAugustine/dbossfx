import mongoose from "mongoose";

const AccountStatementSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  balance: { type: Number, default: 0 },
  earned_profit: { type: Number, default: 0 },
  active_deposit: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
});

delete mongoose.models.AccountStatement;

export default mongoose.model("AccountStatement", AccountStatementSchema);