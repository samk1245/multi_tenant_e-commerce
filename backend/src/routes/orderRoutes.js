const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { resolveTenant } = require("../middleware/tenantMiddleware");

router.use(resolveTenant);

router.post("/", createOrder);
router.get("/", getOrders);
router.put("/:id/status", updateOrderStatus);

module.exports = router;
