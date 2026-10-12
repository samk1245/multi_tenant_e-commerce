const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: [true, "Product must belong to a tenant"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    compareAtPrice: {
      type: Number,
      default: null,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    thumbnail: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      default: 10,
      min: 0,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 18,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    badge: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "draft", "archived"],
      default: "active",
    },
  },
  { timestamps: true }
);

productSchema.pre("save", function () {
  if (!this.slug && this.title) {
    this.slug =
      this.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Math.floor(1000 + Math.random() * 9000);
  }
});

productSchema.index({ tenantId: 1, category: 1 });
productSchema.index({ tenantId: 1, isFeatured: 1 });

module.exports = mongoose.model("Product", productSchema);
