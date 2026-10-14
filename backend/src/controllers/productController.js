const Product = require("../models/Product");
const Tenant = require("../models/Tenant");
const catalogSyncAdapter = require("../integrations/catalogSyncAdapter");

// @desc    Get products scoped to the current tenant or global marketplace
// @route   GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    // 1. Resolve tenant filter
    let tenantFilter = {};
    if (req.tenantId) {
      tenantFilter = { tenantId: req.tenantId };
    } else if (req.query.tenantSlug && req.query.tenantSlug !== "all") {
      const tenant = await Tenant.findOne({ slug: req.query.tenantSlug.toLowerCase() });
      if (tenant) tenantFilter = { tenantId: tenant._id };
    } else if (req.query.tenantId && req.query.tenantId !== "all") {
      tenantFilter = { tenantId: req.query.tenantId };
    }

    // 2. Query filters
    const query = { ...tenantFilter, status: "active" };

    if (req.query.category && req.query.category !== "All") {
      query.category = req.query.category;
    }

    if (req.query.brand && req.query.brand !== "All") {
      query.brand = req.query.brand;
    }

    if (req.query.featured === "true") {
      query.isFeatured = true;
    }

    if (req.query.inStock === "true") {
      query.stock = { $gt: 0 };
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }

    // Minimum rating filter (e.g. 4 stars and above)
    if (req.query.minRating) {
      query.rating = { $gte: parseFloat(req.query.minRating) };
    }

    // Search filter across title, description, category, and brand
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), "i");
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { brand: searchRegex },
      ];
    }

    // 3. Sorting
    let sort = { createdAt: -1 };
    if (req.query.sort === "price-low") sort = { price: 1 };
    if (req.query.sort === "price-high") sort = { price: -1 };
    if (req.query.sort === "rating") sort = { rating: -1 };
    if (req.query.sort === "newest") sort = { createdAt: -1 };

    // 4. Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const [products, totalCount] = await Promise.all([
      Product.find(query).populate("tenantId", "name slug logo category").sort(sort).skip(skip).limit(limit),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: products.length,
      total: totalCount,
      page,
      pages: Math.ceil(totalCount / limit) || 1,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get autocomplete search suggestions
// @route   GET /api/products/suggestions
exports.getSearchSuggestions = async (req, res, next) => {
  try {
    const q = req.query.q || "";
    if (!q || q.length < 2) {
      return res.json({ success: true, suggestions: [] });
    }

    const regex = new RegExp(q.trim(), "i");
    const matches = await Product.find({ title: regex, status: "active" })
      .select("title category thumbnail price")
      .limit(6);

    const suggestions = matches.map((m) => ({
      id: m._id,
      title: m.title,
      category: m.category,
      price: m.price,
      thumbnail: m.thumbnail,
    }));

    res.json({ success: true, suggestions });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product with tenant details
// @route   GET /api/products/:id
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("tenantId", "name slug logo category tagline");
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Add review to product
// @route   POST /api/products/:id/reviews
exports.addProductReview = async (req, res, next) => {
  try {
    const { rating, comment, userName } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const reviewObj = {
      userId: req.user ? req.user._id : null,
      userName: userName || (req.user ? req.user.name : "Verified Shopper"),
      rating: Math.max(1, Math.min(5, Number(rating) || 5)),
      comment: comment || "Great product, highly recommended!",
      createdAt: new Date(),
    };

    product.reviews.unshift(reviewObj);
    product.reviewsCount = (product.reviewsCount || 0) + 1;

    // Recalculate average rating
    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = Math.round((totalRating / product.reviews.length) * 10) / 10;

    await product.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: product,
    });
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

// @desc    Sync external catalog (DummyJSON adapter)
// @route   POST /api/products/sync
exports.syncCatalog = async (req, res, next) => {
  try {
    const tenantId = req.tenantId || req.body.tenantId;
    if (!tenantId) {
      return res.status(400).json({ success: false, message: "Tenant is required for catalog sync" });
    }

    const category = req.body.category || "all";
    const limit = parseInt(req.body.limit) || 8;

    const imported = await catalogSyncAdapter.syncTenantProducts(tenantId, category, limit);

    res.json({
      success: true,
      message: `Successfully synchronized ${imported.length} products to store catalog`,
      count: imported.length,
      data: imported,
    });
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
