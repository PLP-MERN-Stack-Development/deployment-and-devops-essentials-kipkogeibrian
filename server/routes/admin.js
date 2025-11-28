const express = require("express");
const { 
  getUsers, 
  getUserDetails, 
  updateUser, 
  createUser, 
  deleteUser, 
  resetPassword, 
  getUserStats,
  getUnpaidPenalties,
  markPenaltyPaid
} = require("../controllers/adminController");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken, requireAdmin);

router.get("/users", getUsers);
router.get("/users-stats", getUserStats);
router.get("/users/:id", getUserDetails);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.post("/users/:id/reset-password", resetPassword);
router.get("/unpaid-penalties", getUnpaidPenalties);
router.post("/books/:id/mark-penalty-paid", markPenaltyPaid);

module.exports = router;