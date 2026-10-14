const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrder,
  getOrderTracking,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");
const { resolveTenant } = require("../middleware/tenantMiddleware");

router.use(resolveTenant);

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrder);
router.get("/:id/tracking", getOrderTracking);
router.put("/:id/status", updateOrderStatus);
router.post("/:id/cancel", cancelOrder);

module.exports = router;
