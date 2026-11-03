const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tenant name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Tenant slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    tagline: {
      type: String,
      default: "Welcome to our store",
    },
    description: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: "",
    },
    bannerImage: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "Retail",
    },
    theme: {
      primaryColor: {
        type: String,
        default: "#6366f1", // indigo
      },
      accentColor: {
        type: String,
        default: "#4f46e5",
      },
      heroGradient: {
        type: String,
        default: "from-indigo-600 to-violet-700",
      },
    },
    contactEmail: {
      type: String,
      default: "support@store.com",
    },
    currency: {
      type: String,
      default: "INR",
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 120,
    },
    followersCount: {
      type: Number,
      default: 1840,
    },
    owner: {
      name: { type: String, default: "Authorized Merchant" },
      role: { type: String, default: "Founder & Lead Curator" },
      verified: { type: Boolean, default: true },
      memberSince: { type: String, default: "2024" },
    },
    featuredOffers: {
      type: [String],
      default: ["20% OFF FIRST ORDER", "FREE EXPRESS SHIPPING"],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tenant", tenantSchema);
