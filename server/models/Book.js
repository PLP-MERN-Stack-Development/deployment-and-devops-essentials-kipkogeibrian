const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, unique: true },
  publishedYear: Number,
  genre: String,
  available: { type: Boolean, default: true },
  borrower: String,
  borrowerEmail: String,
  borrowerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  borrowedDate: Date,
  dueDate: Date,
  returnDate: Date,
  daysOverdue: { type: Number, default: 0 },
  penaltyAmount: { type: Number, default: 0 },
  penaltyPaid: { type: Boolean, default: false },
  penaltyPaymentHistory: [{
    amount: Number,
    paymentDate: { type: Date, default: Date.now },
    paymentMethod: String,
    transactionId: String,
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  status: { type: String, default: "available" }
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);