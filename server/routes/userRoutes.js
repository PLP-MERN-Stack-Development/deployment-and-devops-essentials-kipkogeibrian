const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateUser,
  createUser,
  deleteUser,
  resetPassword,
  getUserStats
} = require("../controllers/userController");
const {
  getAllUnpaidPenalties,
  markPenaltyPaid
} = require("../controllers/paymentController");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// User management routes
router.get("/users", getAllUsers);
router.get("/users-stats", getUserStats);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.post("/users/:id/reset-password", resetPassword);

// Penalty management routes
router.get("/unpaid-penalties", getAllUnpaidPenalties);
router.post("/books/:id/mark-penalty-paid", markPenaltyPaid);

module.exports = router;