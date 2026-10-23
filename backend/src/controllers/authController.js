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

// Helper to resolve user from auth token or email query
async function resolveUser(req) {
  if (req.user && req.user._id) {
    return await User.findById(req.user._id);
  }
  const email = (req.query?.email || req.body?.email || "customer@example.com").toLowerCase();
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: "Rahul Verma",
      email: email,
      password: "password123",
      phone: "+91 91234 56789",
      addresses: [
        {
          label: "Home",
          name: "Rahul Verma",
          phone: "+91 91234 56789",
          street: "Flat 402, Sea View Apartments, Bandra West",
          city: "Mumbai",
          state: "Maharashtra",
          zip: "400050",
          country: "India",
          isDefault: true,
        },
      ],
    });
  }
  return user;
}

// @desc    Get saved addresses
// @route   GET /api/auth/addresses
exports.getAddresses = async (req, res, next) => {
  try {
    const user = await resolveUser(req);
    res.json({ success: true, count: user.addresses?.length || 0, data: user.addresses || [] });
  } catch (error) {
    next(error);
  }
};

// @desc    Add new address
// @route   POST /api/auth/addresses
exports.addAddress = async (req, res, next) => {
  try {
    const user = await resolveUser(req);
    const { label, name, phone, street, city, state, zip, country = "India", isDefault = false } = req.body;

    if (!street || !city || !state || !zip) {
      return res.status(400).json({ success: false, message: "Street, city, state, and zip are required" });
    }

    if (isDefault || !user.addresses || user.addresses.length === 0) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }

    user.addresses.push({
      label: label || "Home",
      name: name || user.name,
      phone: phone || user.phone,
      street,
      city,
      state,
      zip,
      country,
      isDefault: isDefault || user.addresses.length === 0,
    });

    await user.save();
    res.status(201).json({ success: true, message: "Address added successfully", data: user.addresses });
  } catch (error) {
    next(error);
  }
};

// @desc    Update existing address
// @route   PUT /api/auth/addresses/:addressId
exports.updateAddress = async (req, res, next) => {
  try {
    const user = await resolveUser(req);
    const { addressId } = req.params;
    const { label, name, phone, street, city, state, zip, country = "India", isDefault } = req.body;

    const addr = user.addresses.id(addressId);
    if (!addr) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    if (isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
      addr.isDefault = true;
    } else if (isDefault === false) {
      addr.isDefault = false;
    }

    if (label) addr.label = label;
    if (name) addr.name = name;
    if (phone) addr.phone = phone;
    if (street) addr.street = street;
    if (city) addr.city = city;
    if (state) addr.state = state;
    if (zip) addr.zip = zip;
    if (country) addr.country = country;

    await user.save();
    res.json({ success: true, message: "Address updated successfully", data: user.addresses });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an address
// @route   DELETE /api/auth/addresses/:addressId
exports.deleteAddress = async (req, res, next) => {
  try {
    const user = await resolveUser(req);
    const { addressId } = req.params;

    const addrIndex = user.addresses.findIndex((a) => a._id.toString() === addressId);
    if (addrIndex === -1) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    const wasDefault = user.addresses[addrIndex].isDefault;
    user.addresses.splice(addrIndex, 1);

    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    res.json({ success: true, message: "Address removed", data: user.addresses });
  } catch (error) {
    next(error);
  }
};

// @desc    Set default address
// @route   PATCH /api/auth/addresses/:addressId/default
exports.setDefaultAddress = async (req, res, next) => {
  try {
    const user = await resolveUser(req);
    const { addressId } = req.params;

    const addr = user.addresses.id(addressId);
    if (!addr) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    user.addresses.forEach((a) => (a.isDefault = a._id.toString() === addressId));
    await user.save();

    res.json({ success: true, message: "Default address updated", data: user.addresses });
  } catch (error) {
    next(error);
  }
};
