const express = require("express");
const router = express.Router();
const shippingAdapter = require("../integrations/shippingAdapter");

// @desc    Check pincode serviceability and delivery estimates
// @route   GET /api/shipping/check?pincode=10001
router.get("/check", (req, res) => {
  const pincode = req.query.pincode || req.query.zip || "10001";
  const result = shippingAdapter.checkPincodeServiceability(pincode);
  res.json({ success: true, data: result });
});

module.exports = router;
