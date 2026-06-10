const express = require("express");

const router = express.Router();

const auth =
  require("../middleware/authMiddleware");

const admin =
  require("../middleware/adminMiddleware");

const {
  dashboard,
  getUsers,
  getResults,
  getViolations
} = require("../controllers/adminController");

router.get(
  "/dashboard",
  auth,
  admin,
  dashboard
);

router.get(
  "/users",
  auth,
  admin,
  getUsers
);

router.get(
  "/results",
  auth,
  admin,
  getResults
);

router.get(
  "/violations",
  auth,
  admin,
  getViolations
);

module.exports = router;