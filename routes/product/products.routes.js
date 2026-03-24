const express = require("express");
const { query, param } = require("express-validator");

const { validate } = require("../../middleware/validation.middleware");

const {
  getProducts,
  getProductById,
  searchProducts,
  getRelatedProducts,
  getFullProductDetails
} = require("../../controllers/productController");

const router = express.Router();

/* ================= PUBLIC ROUTES ================= */



// 🔍 SEARCH
router.get(
  "/search",
  [
    query("key").trim().notEmpty().withMessage("Search key is required"),
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 })
  ],
  validate,
  searchProducts
);

// 📦 LIST PRODUCTS
router.get("/", getProducts);

// 📄 FULL DETAILS
router.get("/:id/full", getFullProductDetails);

// 🔗 RELATED PRODUCTS
router.get("/:id/related", getRelatedProducts);

// 📌 SINGLE PRODUCT
router.get("/:id", getProductById);

module.exports = router;
