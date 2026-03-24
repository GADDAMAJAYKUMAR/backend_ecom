const express = require("express");
const { body, param } = require("express-validator");

const { validate } = require("../../middleware/validation.middleware");
const { protect, restrictTo } = require("../../middleware/auth.middleware");

const {
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../../controllers/productController");

const router = express.Router();

/* ================= ADMIN ROUTES ================= */

// Apply auth + admin to all routes
router.use(protect, restrictTo('admin'));



// ➕ CREATE PRODUCT
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Product name is required"),
    body("originalPrice").isFloat({ gt: 0 }),
    body("category").notEmpty()
  ],
  validate,
  createProduct
);

// ✏️ UPDATE PRODUCT
router.put(
  "/:id",
  [param("id").isUUID()],
  validate,
  updateProduct
);

// ❌ DELETE PRODUCT
router.delete(
  "/:id",
  [param("id").isUUID()],
  validate,
  deleteProduct
);

module.exports = router;
