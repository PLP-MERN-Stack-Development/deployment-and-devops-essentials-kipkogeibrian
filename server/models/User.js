const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  isActive: { type: Boolean, default: true },
  totalFinesPaid: { type: Number, default: 0 },
  finesHistory: [{
    amount: Number,
    bookTitle: String,
    bookId: mongoose.Schema.Types.ObjectId,
    paymentDate: { type: Date, default: Date.now },
    paymentMethod: String,
    transactionId: String
  }],
  lastLogin: { type: Date },
  loginCount: { type: Number, default: 0 },
  accountCreated: { type: Date, default: Date.now },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);