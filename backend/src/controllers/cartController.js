const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @desc    Get user's persistent cart
// @route   GET /api/cart
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate("items.product");
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Add or update item in cart
// @route   POST /api/cart/items
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, variant = "Standard" } = req.body;
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.selectedVariant === variant
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        selectedVariant: variant,
      });
    }

    await cart.save();
    await cart.populate("items.product");

    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:itemId
exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    if (quantity <= 0) {
      cart.items.pull(req.params.itemId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate("items.product");

    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
exports.removeCartItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items.pull(req.params.itemId);
    await cart.save();
    await cart.populate("items.product");

    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Merge guest cart items upon login
// @route   POST /api/cart/merge
exports.mergeCart = async (req, res, next) => {
  try {
    const { guestItems = [] } = req.body;
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    for (const gItem of guestItems) {
      const pId = gItem.productId || gItem._id;
      const existing = cart.items.find((item) => item.product.toString() === pId);
      if (existing) {
        existing.quantity += gItem.quantity || 1;
      } else {
        cart.items.push({
          product: pId,
          quantity: gItem.quantity || 1,
          selectedVariant: gItem.variant || "Standard",
        });
      }
    }

    await cart.save();
    await cart.populate("items.product");

    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};
