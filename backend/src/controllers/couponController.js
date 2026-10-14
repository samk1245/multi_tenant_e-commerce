const Coupon = require("../models/Coupon");

// @desc    Validate a promo coupon
// @route   POST /api/coupons/validate
exports.validateCoupon = async (req, res, next) => {
  try {
    const { code, subtotal = 0, tenantId } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: "Please provide a coupon code" });
    }

    const codeUpper = code.trim().toUpperCase();

    // 1. Check database coupons
    let coupon = await Coupon.findOne({ code: codeUpper, isActive: true });

    // 2. Built-in promo presets if not in database
    if (!coupon) {
      if (codeUpper === "VIP15") {
        coupon = {
          code: "VIP15",
          discountPercent: 15,
          minOrderAmount: 50,
          maxDiscountAmount: 100,
          description: "15% VIP Customer Discount",
        };
      } else if (codeUpper === "DROP10") {
        coupon = {
          code: "DROP10",
          discountPercent: 10,
          minOrderAmount: 0,
          maxDiscountAmount: 50,
          description: "10% Flash Drop Discount",
        };
      } else if (codeUpper === "SUPER20") {
        coupon = {
          code: "SUPER20",
          discountPercent: 20,
          minOrderAmount: 100,
          maxDiscountAmount: 150,
          description: "20% Super Saver on Orders $100+",
        };
      }
    }

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: `Invalid or expired promo code "${codeUpper}". Try 'VIP15' or 'DROP10'`,
      });
    }

    if (subtotal < (coupon.minOrderAmount || 0)) {
      return res.status(400).json({
        success: false,
        message: `Order subtotal must be at least $${coupon.minOrderAmount} to apply "${coupon.code}"`,
      });
    }

    const rawDiscount = (subtotal * coupon.discountPercent) / 100;
    const discountAmount = Math.round(Math.min(rawDiscount, coupon.maxDiscountAmount || 500) * 100) / 100;

    res.json({
      success: true,
      data: {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        discountAmount,
        description: coupon.description,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all active coupons
// @route   GET /api/coupons
exports.getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({ isActive: true });
    res.json({ success: true, count: coupons.length, data: coupons });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new coupon (merchant or admin)
// @route   POST /api/coupons
exports.createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    next(error);
  }
};
