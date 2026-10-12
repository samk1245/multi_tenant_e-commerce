const Product = require("../models/Product");
const Tenant = require("../models/Tenant");

// @desc    Get products scoped to the current tenant
// @route   GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    // 1. Resolve tenant filter
    let tenantFilter = {};
    if (req.tenantId) {
      tenantFilter = { tenantId: req.tenantId };
    } else if (req.query.tenantSlug) {
      const tenant = await Tenant.findOne({ slug: req.query.tenantSlug.toLowerCase() });
      if (tenant) tenantFilter = { tenantId: tenant._id };
    }

    // 2. Additional filters
    const query = { ...tenantFilter, status: "active" };

    if (req.query.category && req.query.category !== "All") {
      query.category = req.query.category;
    }

    if (req.query.featured === "true") {
      query.isFeatured = true;
    }

    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: "i" };
    }

    // 3. Sorting
    let sort = { createdAt: -1 };
    if (req.query.sort === "price-low") sort = { price: 1 };
    if (req.query.sort === "price-high") sort = { price: -1 };
    if (req.query.sort === "rating") sort = { rating: -1 };

    const products = await Product.find(query).sort(sort);

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product (scoped to tenant)
// @route   POST /api/products
exports.createProduct = async (req, res, next) => {
  try {
    const tenantId = req.tenantId || req.body.tenantId;
    if (!tenantId) {
      return res.status(400).json({ success: false, message: "Tenant is required to create a product" });
    }

    const product = await Product.create({
      ...req.body,
      tenantId,
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};
