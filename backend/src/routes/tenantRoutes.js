const express = require("express");
const router = express.Router();
const {
  getAllTenants,
  getTenant,
  createTenant,
  updateTenant,
  getTenantAnalytics,
} = require("../controllers/tenantController");

router.get("/", getAllTenants);
router.post("/", createTenant);
router.get("/:identifier", getTenant);
router.put("/:id", updateTenant);
router.get("/:id/analytics", getTenantAnalytics);

module.exports = router;
