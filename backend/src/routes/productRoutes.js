const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProduct,
  getSearchSuggestions,
  addProductReview,
  createProduct,
  updateProduct,
  deleteProduct,
  syncCatalog,
} = require("../controllers/productController");
const { resolveTenant } = require("../middleware/tenantMiddleware");
const { protect } = require("../middleware/auth");

router.use(resolveTenant);

router.get("/", getProducts);
router.get("/suggestions", getSearchSuggestions);
router.post("/sync", syncCatalog);
router.get("/:id", getProduct);
router.post("/:id/reviews", addProductReview);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
