const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "multitenant_jwt_secret_dev", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, tenantId, phone } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required" });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User with this email already exists" });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || "customer",
      tenantId: tenantId || null,
      phone: phone || "",
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        phone: user.phone,
        addresses: user.addresses || [],
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        phone: user.phone,
        addresses: user.addresses || [],
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        phone: user.phone,
        addresses: user.addresses || [],
        wishlist: user.wishlist || [],
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, addresses } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (addresses) user.addresses = addresses;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        phone: user.phone,
        addresses: user.addresses,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle item in wishlist
// @route   POST /api/auth/wishlist/toggle
exports.toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const index = user.wishlist.indexOf(productId);
    let added = false;

    if (index > -1) {
      user.wishlist.splice(index, 1);
      added = false;
    } else {
      user.wishlist.push(productId);
      added = true;
    }

    await user.save();
    const updatedUser = await User.findById(req.user._id).populate("wishlist");

    res.json({
      success: true,
      action: added ? "added" : "removed",
      wishlist: updatedUser.wishlist,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's order history
// @route   GET /api/auth/orders
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      $or: [{ userId: req.user._id }, { "customer.email": req.user.email }],
    }).sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};
