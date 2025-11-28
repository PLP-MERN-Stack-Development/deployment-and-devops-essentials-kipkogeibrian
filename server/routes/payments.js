const express = require("express");
const { 
  payPenalty, 
  getPaymentMethods, 
  getPaymentHistory 
} = require("../controllers/paymentController");
const { 
  authenticateToken, 
  requireBorrowerOrAdmin 
} = require("../middleware/auth");

const router = express.Router();

router.use(authenticateToken);

router.get("/payment/methods", getPaymentMethods);
router.get("/payments/history", getPaymentHistory);
router.post("/books/:id/pay-penalty", requireBorrowerOrAdmin, payPenalty);

module.exports = router;