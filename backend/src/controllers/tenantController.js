const Tenant = require("../models/Tenant");
const Product = require("../models/Product");
const Order = require("../models/Order");

// @desc    Get all active tenants (for tenant switcher)
// @route   GET /api/tenants
exports.getAllTenants = async (req, res, next) => {
  try {
    const tenants = await Tenant.find({ status: "active" }).sort({ createdAt: -1 });
    res.json({ success: true, count: tenants.length, data: tenants });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single tenant by slug or ID
// @route   GET /api/tenants/:identifier
exports.getTenant = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let tenant;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      tenant = await Tenant.findById(identifier);
    } else {
      tenant = await Tenant.findOne({ slug: identifier.toLowerCase() });
    }

    if (!tenant) {
      return res.status(404).json({ success: false, message: "Tenant store not found" });
    }

    res.json({ success: true, data: tenant });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new tenant store
// @route   POST /api/tenants
exports.createTenant = async (req, res, next) => {
  try {
    const { name, slug, tagline, description, category, theme, contactEmail } = req.body;

    const existingSlug = await Tenant.findOne({ slug: slug.toLowerCase() });
    if (existingSlug) {
      return res.status(400).json({ success: false, message: "Store slug already exists. Please pick another." });
    }

    const tenant = await Tenant.create({
      name,
      slug: slug.toLowerCase().replace(/\s+/g, "-"),
      tagline,
      description,
      category,
      theme,
      contactEmail,
    });

    res.status(201).json({ success: true, data: tenant });
  } catch (error) {
    next(error);
  }
};

// @desc    Update tenant branding & settings
// @route   PUT /api/tenants/:id
exports.updateTenant = async (req, res, next) => {
  try {
    const tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!tenant) {
      return res.status(404).json({ success: false, message: "Tenant store not found" });
    }

    res.json({ success: true, data: tenant });
  } catch (error) {
    next(error);
  }
};

// @desc    Get analytics / KPI stats for merchant dashboard
// @route   GET /api/tenants/:id/analytics
exports.getTenantAnalytics = async (req, res, next) => {
  try {
    const tenantId = req.params.id;

    const [productsCount, orders] = await Promise.all([
      Product.countDocuments({ tenantId }),
      Order.find({ tenantId }).sort({ createdAt: -1 }),
    ]);

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        productsCount,
        totalOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        avgOrderValue: parseFloat(avgOrderValue),
        recentOrders: orders.slice(0, 5),
      },
    });
  } catch (error) {
    next(error);
  }
};
