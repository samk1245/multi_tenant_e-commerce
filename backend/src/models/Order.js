const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  thumbnail: {
    type: String,
    default: "",
  },
});

const orderSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, default: "" },
      address: {
        street: { type: String, default: "123 Main St" },
        city: { type: String, default: "New York" },
        state: { type: String, default: "NY" },
        zip: { type: String, default: "10001" },
        country: { type: String, default: "USA" },
      },
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    couponCode: {
      type: String,
      default: "",
    },
    shipping: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      default: "card",
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "failed", "refunded"],
      default: "paid",
    },
    paymentDetails: {
      provider: { type: String, default: "test_gateway" },
      transactionId: { type: String, default: "" },
      signature: { type: String, default: "" },
    },
    shippingDetails: {
      carrier: { type: String, default: "Express Direct" },
      trackingNumber: { type: String, default: "" },
      estimatedDelivery: { type: String, default: "3-5 Business Days" },
    },
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "confirmed", "shipped", "out_for_delivery", "delivered", "cancelled"],
      default: "processing",
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

orderSchema.index({ tenantId: 1, createdAt: -1 });
orderSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);
