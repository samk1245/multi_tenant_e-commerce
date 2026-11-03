const express = require("express");
const router = express.Router();
const {
  getAllTenants,
  getTenant,
  createTenant,
  updateTenant,
  getTenantAnalytics,
  toggleFollowTenant,
} = require("../controllers/tenantController");

router.get("/", getAllTenants);
router.post("/", createTenant);
router.get("/:identifier", getTenant);
router.put("/:id", updateTenant);
router.post("/:id/follow", toggleFollowTenant);
router.get("/:id/analytics", getTenantAnalytics);

module.exports = router;
