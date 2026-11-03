const express = require("express");
const router = express.Router();
const { getAdminOverview, updateTenantStatus } = require("../controllers/adminController");

router.get("/overview", getAdminOverview);
router.patch("/tenants/:id/status", updateTenantStatus);

module.exports = router;
