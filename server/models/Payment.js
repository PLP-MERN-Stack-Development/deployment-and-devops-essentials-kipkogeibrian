const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    enum: ["credit_card", "debit_card", "paypal", "cash", "bank_transfer", "mobile_money"],
    required: true 
  },
  transactionId: { type: String, unique: true },
  status: { 
    type: String, 
    enum: ["pending", "completed", "failed", "refunded"],
    default: "completed" 
  },
  paymentDate: { type: Date, default: Date.now },
  cardLastFour: String,
  paymentGateway: String,
  gatewayResponse: Object
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);