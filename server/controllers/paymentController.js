const Payment = require("../models/Payment");
const Book = require("../models/Book");
const User = require("../models/User");

// Generate unique transaction ID
const generateTransactionId = () => {
  return `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

// Simulate payment gateway
const simulatePaymentGateway = async (paymentData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const success = Math.random() > 0.05;
      resolve({
        success,
        transactionId: generateTransactionId(),
        gateway: "simulated_gateway",
        message: success ? "Payment processed successfully" : "Payment failed",
        rawResponse: { simulated: true, timestamp: new Date() }
      });
    }, 1000);
  });
};

// Process penalty payment
const payPenalty = async (req, res) => {
  try {
    const { paymentMethod, cardLastFour } = req.body;
    const book = await Book.findById(req.params.id);
    
    if (!book) return res.status(404).json({ error: "Book not found" });
    if (book.penaltyAmount <= 0) return res.status(400).json({ error: "No penalty to pay" });
    if (book.penaltyPaid) return res.status(400).json({ error: "Penalty already paid" });

    const paymentResult = await simulatePaymentGateway({
      amount: book.penaltyAmount,
      paymentMethod,
      cardLastFour
    });

    if (!paymentResult.success) {
      return res.status(400).json({ error: "Payment failed. Please try again." });
    }

    const payment = new Payment({
      userId: req.user.userId,
      bookId: book._id,
      amount: book.penaltyAmount,
      paymentMethod,
      transactionId: paymentResult.transactionId,
      status: "completed",
      cardLastFour,
      paymentGateway: paymentResult.gateway,
      gatewayResponse: paymentResult.rawResponse
    });
    await payment.save();

    book.penaltyPaid = true;
    book.penaltyPaymentHistory.push({
      amount: book.penaltyAmount,
      paymentMethod,
      transactionId: paymentResult.transactionId,
      paidBy: req.user.userId
    });
    await book.save();

    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { totalFinesPaid: book.penaltyAmount },
      $push: {
        finesHistory: {
          amount: book.penaltyAmount,
          bookTitle: book.title,
          bookId: book._id,
          paymentMethod,
          transactionId: paymentResult.transactionId
        }
      }
    });

    res.json({
      message: "Penalty paid successfully",
      payment: {
        transactionId: paymentResult.transactionId,
        amount: book.penaltyAmount,
        paymentMethod,
        date: new Date()
      },
      book
    });
  } catch (error) {
    console.error("Pay penalty error:", error);
    res.status(400).json({ error: "Failed to process payment" });
  }
};

// Get payment methods
const getPaymentMethods = (req, res) => {
  res.json({
    methods: [
      { value: "credit_card", label: "💳 Credit Card" },
      { value: "debit_card", label: "💳 Debit Card" },
      { value: "paypal", label: "🔵 PayPal" },
      { value: "cash", label: "💰 Cash" },
      { value: "bank_transfer", label: "🏦 Bank Transfer" },
      { value: "mobile_money", label: "📱 Mobile Money" }
    ]
  });
};

// Get user's payment history
const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.userId })
      .populate('bookId', 'title author')
      .sort({ paymentDate: -1 });
    
    res.json(payments);
  } catch (error) {
    console.error("Get payment history error:", error);
    res.status(500).json({ error: "Failed to fetch payment history" });
  }
};

// Get books with unpaid penalties for current user
const getMyUnpaidPenalties = async (req, res) => {
  try {
    const booksWithUnpaidPenalties = await Book.find({
      borrowerId: req.user.userId,
      penaltyAmount: { $gt: 0 },
      penaltyPaid: false
    }).sort({ dueDate: -1 });
    
    res.json(booksWithUnpaidPenalties);
  } catch (error) {
    console.error("Get unpaid penalties error:", error);
    res.status(500).json({ error: "Failed to fetch unpaid penalties" });
  }
};

module.exports = {
  payPenalty,
  getPaymentMethods,
  getPaymentHistory,
  getMyUnpaidPenalties,
  generateTransactionId
};