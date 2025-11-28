const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Book = require("../models/Book");

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "library-dev-secret-2024", (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Admin Authorization Middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

// Borrower Authorization Middleware
const requireBorrowerOrAdmin = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    if (req.user.role === "admin") {
      return next();
    }

    if (!book.borrowerId || book.borrowerId.toString() !== req.user.userId) {
      return res.status(403).json({ 
        error: "Only the user who borrowed this book can return it" 
      });
    }

    next();
  } catch (error) {
    console.error("Borrower authorization error:", error);
    res.status(500).json({ error: "Authorization check failed" });
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireBorrowerOrAdmin
};