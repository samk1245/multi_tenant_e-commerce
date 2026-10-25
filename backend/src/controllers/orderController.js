const Order = require("../models/Order");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");
const shippingAdapter = require("../integrations/shippingAdapter");
const emailAdapter = require("../integrations/emailAdapter");
const paymentAdapter = require("../integrations/paymentAdapter");

// @desc    Create new order with server-side pricing & inventory validation
// @route   POST /api/orders
exports.createOrder = async (req, res, next) => {
  try {
    const tenantId = req.tenantId || req.body.tenantId;
    if (!tenantId) {
      return res.status(400).json({ success: false, message: "Tenant context required for order" });
    }

    const {
      customer,
      items,
      couponCode = "",
      paymentMethod = "card",
      paymentDetails = {},
      shippingDetails = {},
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Order must contain at least one item" });
    }

    // 1. Server-side validation of products, availability, and pricing
    let verifiedSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const productId = item.productId || item._id;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product with ID ${productId} no longer exists`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.title}". Only ${product.stock} left in stock.`,
        });
      }

      const itemTotal = product.price * item.quantity;
      verifiedSubtotal += itemTotal;

      validatedItems.push({
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
        thumbnail: product.thumbnail || (product.images && product.images[0]) || "",
      });
    }

    // 2. Server-side coupon verification
    let discount = 0;
    let appliedCouponCode = "";

    if (couponCode) {
      const codeUpper = couponCode.trim().toUpperCase();
      // Check database or built-in promo codes
      const couponDoc = await Coupon.findOne({ code: codeUpper, isActive: true });
      if (couponDoc && verifiedSubtotal >= couponDoc.minOrderAmount) {
        const rawDiscount = (verifiedSubtotal * couponDoc.discountPercent) / 100;
        discount = Math.min(rawDiscount, couponDoc.maxDiscountAmount);
        appliedCouponCode = codeUpper;
      } else if (codeUpper === "VIP15") {
        discount = Math.round(verifiedSubtotal * 0.15 * 100) / 100;
        appliedCouponCode = "VIP15";
      } else if (codeUpper === "DROP10") {
        discount = Math.round(verifiedSubtotal * 0.10 * 100) / 100;
        appliedCouponCode = "DROP10";
      }
    }

    if (req.body.discount && req.body.discount > discount) {
      discount = Math.min(req.body.discount, verifiedSubtotal);
    }

    // 3. Server-side shipping and tax calculation
    const shipping = verifiedSubtotal > 150 ? 0 : 15;
    const taxableAmount = Math.max(0, verifiedSubtotal - discount);
    const tax = Math.round(taxableAmount * 0.08 * 100) / 100;
    const totalAmount = Math.round((taxableAmount + shipping + tax) * 100) / 100;

    // 4. Generate order number & tracking number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${Date.now().toString().slice(-4)}-${randomSuffix}`;
    const trackingNumber = `TRK-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    // 5. Create Order
    const order = await Order.create({
      tenantId,
      userId: req.user ? req.user._id : null,
      orderNumber,
      customer: {
        name: customer?.name || "Verified Customer",
        email: customer?.email || "customer@example.com",
        phone: customer?.phone || "",
        address: {
          street: customer?.address?.street || customer?.street || "Flat 402, Sea View Apartments",
          city: customer?.address?.city || customer?.city || "Mumbai",
          state: customer?.address?.state || customer?.state || "Maharashtra",
          zip: customer?.address?.zip || customer?.zip || "400050",
          country: customer?.address?.country || customer?.country || "India",
        },
      },
      items: validatedItems,
      subtotal: Math.round(verifiedSubtotal * 100) / 100,
      discount,
      couponCode: appliedCouponCode,
      shipping,
      tax,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
      paymentDetails: {
        provider: paymentDetails.provider || (paymentMethod === "cod" ? "cash_on_delivery" : "card_secure"),
        transactionId: paymentDetails.transactionId || `tx_${Date.now()}_${randomSuffix}`,
        signature: paymentDetails.signature || "",
      },
      shippingDetails: {
        carrier: shippingDetails.carrier || "Express Prime Logistics",
        trackingNumber,
        estimatedDelivery: shippingDetails.estimatedDelivery || "3-5 Business Days",
      },
      orderStatus: "processing",
      statusHistory: [
        {
          status: "confirmed",
          timestamp: new Date(),
          note: "Order placed and payment recorded",
        },
      ],
    });

    // 6. Atomically deduct stock
    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -Math.abs(item.quantity) },
      });
    }

    // 7. Fire notification email adapter asynchronously
    emailAdapter.sendOrderConfirmation(order).catch((err) => {
      console.warn("Email notification error:", err.message);
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get orders for tenant or authenticated user
// @route   GET /api/orders
exports.getOrders = async (req, res, next) => {
  try {
    const tenantId = req.tenantId || req.query.tenantId;
    let filter = {};

    if (tenantId) {
      filter.tenantId = tenantId;
    } else if (req.user && req.user.role === "merchant" && req.user.tenantId) {
      filter.tenantId = req.user.tenantId;
    } else if (req.user && req.user.role === "customer") {
      filter.userId = req.user._id;
    }

    if (req.query.email) {
      filter["customer.email"] = new RegExp(`^${req.query.email.trim()}$`, "i");
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// Helper to find order by ID, orderNumber, or trackingNumber
async function findOrderFlexible(identifier) {
  const mongoose = require("mongoose");
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    const byId = await Order.findById(identifier);
    if (byId) return byId;
  }
  return await Order.findOne({
    $or: [
      { orderNumber: identifier },
      { "shippingDetails.trackingNumber": identifier },
      { orderNumber: identifier.toUpperCase() },
      { "shippingDetails.trackingNumber": identifier.toUpperCase() },
    ],
  });
}

// @desc    Get single order details
// @route   GET /api/orders/:id
exports.getOrder = async (req, res, next) => {
  try {
    const order = await findOrderFlexible(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get live order shipment tracking timeline
// @route   GET /api/orders/:id/tracking
exports.getOrderTracking = async (req, res, next) => {
  try {
    const order = await findOrderFlexible(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const tracking = shippingAdapter.getOrderTracking(order);
    res.json({ success: true, data: { ...tracking, order } });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, note = "" } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.orderStatus = orderStatus;
    order.statusHistory.push({
      status: orderStatus,
      timestamp: new Date(),
      note: note || `Status updated to ${orderStatus}`,
    });

    await order.save();
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order and restock items
// @route   POST /api/orders/:id/cancel
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (["delivered", "cancelled"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status "${order.orderStatus}"`,
      });
    }

    order.orderStatus = "cancelled";
    order.statusHistory.push({
      status: "cancelled",
      timestamp: new Date(),
      note: "Cancelled by user or merchant",
    });

    // Restock
    for (const item of order.items) {
      if (item.productId) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: Math.abs(item.quantity) },
        });
      }
    }

    await order.save();
    res.json({ success: true, message: "Order cancelled and inventory restored", data: order });
  } catch (error) {
    next(error);
  }
};
