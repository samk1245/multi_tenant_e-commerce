const Tenant = require("../models/Tenant");

/**
 * Resolves the tenant from headers, query params, or subdomain
 * and attaches `req.tenant` and `req.tenantId`
 */
const resolveTenant = async (req, res, next) => {
  try {
    const tenantSlug =
      req.headers["x-tenant-slug"] ||
      req.query.tenant ||
      req.query.tenantSlug ||
      (req.body && req.body.tenantSlug);

    const tenantId =
      req.headers["x-tenant-id"] ||
      req.query.tenantId ||
      (req.body && req.body.tenantId);

    let tenant = null;

    if (tenantId) {
      tenant = await Tenant.findById(tenantId);
    } else if (tenantSlug) {
      tenant = await Tenant.findOne({ slug: tenantSlug.toLowerCase(), status: "active" });
    }

    if (tenant) {
      req.tenant = tenant;
      req.tenantId = tenant._id;
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware that strictly requires an active tenant
 */
const requireTenant = async (req, res, next) => {
  if (!req.tenant) {
    return res.status(400).json({
      success: false,
      message: "Tenant context is required. Please provide 'x-tenant-slug' header or '?tenant=slug' query param.",
    });
  }
  next();
};

module.exports = { resolveTenant, requireTenant };
