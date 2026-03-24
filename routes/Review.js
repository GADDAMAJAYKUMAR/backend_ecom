const express = require("express");
const { body, param, query } = require("express-validator");
const { validate } = require("../middleware/validation.middleware");
const { protect } = require("../middleware/auth.middleware");


const {
  addReview,
  getReviews,
  updateReview,
  deleteReview
} = require("../controllers/ReviewController");

const router = express.Router();

/* ================= ADD REVIEW ================= */
router.post(
  "/:productId/review",
  protect,
  [
    param("productId").isUUID().withMessage("Invalid product id"),
    body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be 1-5"),
    body("comment").trim().notEmpty().withMessage("Comment is required")
  ],
  validate,
  addReview
);

/* ================= GET REVIEWS ================= */
router.get(
  "/:productId/reviews",
  [
    param("productId").isUUID().withMessage("Invalid product id"),
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 50 }),
    query("rating").optional().isInt({ min: 1, max: 5 }),
    query("sort").optional().isString()
  ],
  validate,
  getReviews
);

/* ================= UPDATE REVIEW ================= */
router.put(
  "/:reviewId",
  protect,
  [
    param("reviewId").isUUID().withMessage("Invalid review id"),
    body("rating").optional().isInt({ min: 1, max: 5 }),
    body("comment").optional().trim().notEmpty()
  ],
  validate,
  updateReview
);

/* ================= DELETE REVIEW ================= */
router.delete(
  "/:reviewId",
  protect,
  [param("reviewId").isUUID().withMessage("Invalid review id")],
  validate,
  deleteReview
);

module.exports = router;
