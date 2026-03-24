const express = require("express");
const router = express.Router();

const { getVariantsByProduct, getVariantByColor } = require("../controllers/productVariantController");
const { param, query } = require("express-validator");
const { validate } = require("../middleware/validation.middleware");

// ================= GET ALL VARIANTS =================
router.get(
  "/:productId/variants",
  [
    param("productId").isUUID().withMessage("Invalid product ID")
  ],
  validate,
  getVariantsByProduct
);

// ================= GET VARIANT BY COLOR =================
router.get(
  "/:productId/variant",
  [
    param("productId").isUUID().withMessage("Invalid product ID"),
    query("color").notEmpty().withMessage("Color is required")
  ],
  validate,
  getVariantByColor
);

module.exports = router;
