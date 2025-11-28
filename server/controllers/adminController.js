const User = require("../models/User");
const Book = require("../models/Book");
const bcrypt = require("bcryptjs");

// Get all users
const getUsers = async (req, res) => {
  try {
    const { search, role, status } = req.query;
    let filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    if (role && role !== "all") {
      filter.role = role;
    }

    if (status === "active") {
      filter.isActive = true;
    } else if (status === "inactive") {
      filter.isActive = false;
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const borrowedBooksCount = await Book.countDocuments({ 
          borrowerId: user._id, 
          available: false 
        });
        
        const unpaidPenalties = await Book.aggregate([
          { 
            $match: { 
              borrowerId: user._id, 
              penaltyAmount: { $gt: 0 },
              penaltyPaid: false 
            } 
          },
          { $group: { _id: null, total: { $sum: "$penaltyAmount" } } }
        ]);

        return {
          ...user.toObject(),
          borrowedBooksCount,
          unpaidPenaltiesTotal: unpaidPenalties[0]?.total || 0
        };
      })
    );

    res.json(usersWithStats);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Get user details by ID
const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const borrowedBooks = await Book.find({ 
      borrowerId: user._id,
      available: false 
    }).sort({ borrowedDate: -1 });

    const paymentHistory = await Payment.find({ userId: user._id })
      .populate('bookId', 'title author')
      .sort({ paymentDate: -1 });

    const unpaidPenalties = await Book.find({
      borrowerId: user._id,
      penaltyAmount: { $gt: 0 },
      penaltyPaid: false
    });

    res.json({
      user,
      borrowedBooks,
      paymentHistory,
      unpaidPenalties,
      stats: {
        totalBorrowed: borrowedBooks.length,
        totalPayments: paymentHistory.length,
        totalPaid: paymentHistory.reduce((sum, payment) => sum + payment.amount, 0),
        totalUnpaid: unpaidPenalties.reduce((sum, book) => sum + book.penaltyAmount, 0)
      }
    });
  } catch (error) {
    console.error("Get user details error:", error);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { name, email, role, isActive, notes } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, isActive, notes },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user
    });
  } catch (error) {
    console.error("Update user error:", error);
    if (error.code === 11000) {
      res.status(400).json({ error: "Email already exists" });
    } else {
      res.status(400).json({ error: "Failed to update user" });
    }
  }
};

// Create user
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, notes } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      notes
    });

    await user.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const borrowedBooks = await Book.countDocuments({ 
      borrowerId: req.params.id, 
      available: false 
    });

    if (borrowedBooks > 0) {
      return res.status(400).json({ 
        error: "Cannot delete user with borrowed books. Please return all books first." 
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// Reset user password
const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { password: hashedPassword },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: "admin" });
    const regularUsers = await User.countDocuments({ role: "user" });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    const usersWithPenalties = await Book.aggregate([
      { $match: { penaltyAmount: { $gt: 0 }, penaltyPaid: false } },
      { $group: { _id: "$borrowerId" } },
      { $count: "count" }
    ]);

    res.json({
      totalUsers,
      activeUsers,
      adminUsers,
      regularUsers,
      recentRegistrations,
      usersWithPenalties: usersWithPenalties[0]?.count || 0,
      inactiveUsers: totalUsers - activeUsers
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({ error: "Failed to fetch user statistics" });
  }
};

// Get all unpaid penalties
const getUnpaidPenalties = async (req, res) => {
  try {
    const unpaidPenalties = await Book.find({
      penaltyAmount: { $gt: 0 },
      penaltyPaid: false
    }).populate('borrowerId', 'name email').sort({ dueDate: -1 });
    
    res.json(unpaidPenalties);
  } catch (error) {
    console.error("Get all unpaid penalties error:", error);
    res.status(500).json({ error: "Failed to fetch unpaid penalties" });
  }
};

// Mark penalty as paid manually
const markPenaltyPaid = async (req, res) => {
  try {
    const { paymentMethod = "cash" } = req.body;
    const book = await Book.findById(req.params.id);
    
    if (!book) return res.status(404).json({ error: "Book not found" });
    if (book.penaltyAmount <= 0) return res.status(400).json({ error: "No penalty to mark as paid" });
    if (book.penaltyPaid) return res.status(400).json({ error: "Penalty already paid" });

    const transactionId = generateTransactionId();

    const payment = new Payment({
      userId: book.borrowerId,
      bookId: book._id,
      amount: book.penaltyAmount,
      paymentMethod,
      transactionId,
      status: "completed",
      paymentGateway: "manual"
    });
    await payment.save();

    book.penaltyPaid = true;
    book.penaltyPaymentHistory.push({
      amount: book.penaltyAmount,
      paymentMethod,
      transactionId,
      paidBy: req.user.userId
    });
    await book.save();

    await User.findByIdAndUpdate(book.borrowerId, {
      $inc: { totalFinesPaid: book.penaltyAmount },
      $push: {
        finesHistory: {
          amount: book.penaltyAmount,
          bookTitle: book.title,
          bookId: book._id,
          paymentMethod,
          transactionId
        }
      }
    });

    res.json({
      message: "Penalty marked as paid successfully",
      book
    });
  } catch (error) {
    console.error("Mark penalty paid error:", error);
    res.status(400).json({ error: "Failed to mark penalty as paid" });
  }
};

module.exports = {
  getUsers,
  getUserDetails,
  updateUser,
  createUser,
  deleteUser,
  resetPassword,
  getUserStats,
  getUnpaidPenalties,
  markPenaltyPaid
};