const Tenant = require("../models/Tenant");
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

// @desc    Get Super-Admin Platform Overview
// @route   GET /api/admin/overview
exports.getAdminOverview = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalStores,
      totalProducts,
      orders,
      tenants,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments({}),
      Tenant.countDocuments({}),
      Product.countDocuments({}),
      Order.find({}).sort({ createdAt: -1 }),
      Tenant.find({}).sort({ createdAt: -1 }),
      User.find({}).select("-password").sort({ createdAt: -1 }).limit(8),
    ]);

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    // Active status breakdown
    const activeStores = tenants.filter((t) => t.status === "active").length;
    const pendingReviewStores = tenants.filter((t) => t.status !== "active").length;

    res.json({
      success: true,
      data: {
        metrics: {
          totalUsers,
          totalStores,
          activeStores,
          pendingReviewStores,
          totalProducts,
          totalOrders,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          growthRate: "+24.8% MoM",
          uptime: "99.99%",
        },
        tenants: tenants.map((t) => ({
          _id: t._id,
          name: t.name,
          slug: t.slug,
          category: t.category,
          logo: t.logo,
          status: t.status,
          rating: t.rating || 4.8,
          followersCount: t.followersCount || 1000,
          owner: t.owner || { name: "Store Merchant", verified: true },
          createdAt: t.createdAt,
        })),
        recentOrders: orders.slice(0, 8).map((o) => ({
          _id: o._id,
          orderNumber: o.orderNumber,
          customer: o.customer?.name || "Customer",
          email: o.customer?.email || "",
          total: o.totalAmount,
          status: o.orderStatus,
          paymentStatus: o.paymentStatus,
          createdAt: o.createdAt,
        })),
        recentUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Moderate store status (Approve / Suspend)
// @route   PATCH /api/admin/tenants/:id/status
exports.updateTenantStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const tenant = await Tenant.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!tenant) {
      return res.status(404).json({ success: false, message: "Store not found" });
    }
    res.json({ success: true, message: `Store status updated to ${status}`, data: tenant });
  } catch (error) {
    next(error);
  }
};
