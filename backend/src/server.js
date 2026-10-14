require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const { resolveTenant } = require("./middleware/tenantMiddleware");

// Routes
const tenantRoutes = require("./routes/tenantRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const couponRoutes = require("./routes/couponRoutes");
const shippingRoutes = require("./routes/shippingRoutes");

const app = express();

// Connect Database
connectDB();

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// CORS Configuration
app.use(
  cors({
    origin: "*", // allow all in dev for seamless frontend access
    credentials: true,
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500, // generous limit for development
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// Request parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Logger
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Global tenant resolver (optional context for all routes)
app.use(resolveTenant);

// Health Check & Root
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Multi-Tenant E-Commerce Platform API is running",
    activeTenant: req.tenant ? req.tenant.name : "None (Global)",
    version: "2.0.0",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    tenantContext: req.tenant ? req.tenant.slug : null,
  });
});

// Mount API routes
app.use("/api/tenants", tenantRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/shipping", shippingRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API route ${req.method} ${req.originalUrl} not found`,
  });
});

// Centralized Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Multi-Tenant Server running on http://localhost:${PORT}`);
});

module.exports = app;
