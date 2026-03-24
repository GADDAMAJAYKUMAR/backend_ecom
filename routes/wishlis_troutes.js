const express = require("express");
const { body, param } = require("express-validator");
const { validate } = require("../middleware/validation.middleware");
const { protect } = require("../middleware/auth.middleware");


const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  checkWishlistItem,
  getWishlistById
} = require("../controllers/wishlist.controller");

const router = express.Router();

/* ================= ADD TO WISHLIST ================= */
router.post(
  "/",
  protect,
  [
    body("productId").notEmpty().withMessage("Product ID is required").isUUID().withMessage("Invalid product id")
  ],
  validate,
  addToWishlist
);

/* ================= GET MY WISHLIST ================= */
router.get("/", protect, getWishlist);

/* ================= REMOVE FROM WISHLIST ================= */
router.delete(
  "/:productId",
  protect,
  [param("productId").isUUID().withMessage("Invalid product id")],
  validate,
  removeFromWishlist
);

/* ================= CHECK ITEM IN WISHLIST ================= */
router.get(
  "/check/:productId",
  protect,
  [param("productId").isUUID().withMessage("Invalid product id")],
  validate,
  checkWishlistItem
);

/* ================= GET WISHLIST BY ID ================= */
router.get("/:id", protect, getWishlistById);

module.exports = router;
