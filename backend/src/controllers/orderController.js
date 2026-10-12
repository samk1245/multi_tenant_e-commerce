const Order = require("../models/Order");
const Product = require("../models/Product");

// @desc    Create new order
// @route   POST /api/orders
exports.createOrder = async (req, res, next) => {
  try {
    const tenantId = req.tenantId || req.body.tenantId;
    if (!tenantId) {
      return res.status(400).json({ success: false, message: "Tenant context required for order" });
    }

    const { customer, items, subtotal, shipping = 0, tax = 0, totalAmount, paymentMethod = "card" } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Order must contain at least one item" });
    }

    // Generate friendly order number like ORD-2026-XXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${Date.now().toString().slice(-4)}-${randomSuffix}`;

    const order = await Order.create({
      tenantId,
      orderNumber,
      customer: {
        name: customer.name || "Customer",
        email: customer.email || "customer@example.com",
        phone: customer.phone || "",
        address: customer.address || {
          street: "100 Broadway",
          city: "New York",
          state: "NY",
          zip: "10001",
        },
      },
      items,
      subtotal,
      shipping,
      tax,
      totalAmount,
      paymentMethod,
      paymentStatus: "paid",
      orderStatus: "processing",
    });

    // Deduct stock
    for (const item of items) {
      if (item.productId) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -Math.abs(item.quantity) },
        });
      }
    }

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get orders for tenant
// @route   GET /api/orders
exports.getOrders = async (req, res, next) => {
  try {
    const tenantId = req.tenantId || req.query.tenantId;
    if (!tenantId) {
      return res.status(400).json({ success: false, message: "Tenant ID required" });
    }

    const orders = await Order.find({ tenantId }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};
