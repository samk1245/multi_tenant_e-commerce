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
      default: "USD",
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
