const express = require("express");
const router = express.Router();
const { validateCoupon, getCoupons, createCoupon } = require("../controllers/couponController");

router.post("/validate", validateCoupon);
router.get("/", getCoupons);
router.post("/", createCoupon);

module.exports = router;
