const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  try {
    const { tenantId } = req.query;
    const threshold = Number(req.query.threshold ?? 5);

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "tenantId is required"
      });
    }

    if (!Number.isInteger(threshold) || threshold < 0) {
      return res.status(400).json({
        success: false,
        message: "threshold must be a non-negative integer"
      });
    }

    const products = await Product.find({ tenantId })
      .select("name price stock category")
      .sort({ stock: 1, name: 1 })
      .lean();

    const lowStock = products.filter(
      product => product.stock <= threshold
    );

    res.json({
      success: true,
      summary: {
        totalProducts: products.length,
        lowStockCount: lowStock.length,
        outOfStockCount: products.filter(p => p.stock === 0).length
      },
      products,
      lowStock
    });
  } catch (error) {
    console.error("Inventory API error:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to load inventory"
    });
  }
});

module.exports = router;
