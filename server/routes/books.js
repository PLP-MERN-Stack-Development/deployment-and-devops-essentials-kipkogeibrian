const express = require("express");
const { 
  getBooks, 
  getStats, 
  createBook, 
  updateBook, 
  deleteBook, 
  borrowBook, 
  returnBook, 
  getMyBorrowedBooks 
} = require("../controllers/bookController");
const { 
  getMyUnpaidPenalties 
} = require("../controllers/paymentController");
const { 
  authenticateToken, 
  requireAdmin, 
  requireBorrowerOrAdmin 
} = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    database: "connected", // This will be handled in server.js
    mode: "mongodb-only"
  });
});

// Protected routes
router.get("/books", authenticateToken, getBooks);
router.get("/stats", authenticateToken, getStats);
router.get("/books/my-borrowed", authenticateToken, getMyBorrowedBooks);
router.get("/books/my-unpaid-penalties", authenticateToken, getMyUnpaidPenalties);

// Admin only routes
router.post("/books", authenticateToken, requireAdmin, createBook);
router.put("/books/:id", authenticateToken, requireAdmin, updateBook);
router.delete("/books/:id", authenticateToken, requireAdmin, deleteBook);

// User actions
router.post("/books/:id/borrow", authenticateToken, borrowBook);
router.post("/books/:id/return", authenticateToken, requireBorrowerOrAdmin, returnBook);

module.exports = router;