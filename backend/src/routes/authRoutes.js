const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  toggleWishlist,
  getMyOrders,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.post("/wishlist/toggle", protect, toggleWishlist);
router.get("/orders", protect, getMyOrders);

// Address Management routes (support token or query email)
router.get("/addresses", getAddresses);
router.post("/addresses", addAddress);
router.put("/addresses/:addressId", updateAddress);
router.delete("/addresses/:addressId", deleteAddress);
router.patch("/addresses/:addressId/default", setDefaultAddress);

module.exports = router;
