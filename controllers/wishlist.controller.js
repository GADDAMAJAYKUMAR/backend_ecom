const { Wishlist, Product, ProductImage } = require("../models");
const messages = require('../constants/messages');
const catchAsync = require('../utils/catchAsync');

const sendResponse = (res, { status = 200, success = true, message = "", data = null, meta = null }) => {
  return res.status(status).json({ success, message, meta, data });
};

/* ================= ADD ================= */
const addToWishlist = catchAsync(async (req, res, next) => {
    const userId = req.user?.id;
    const { productId } = req.body;
    if (!userId) throw new Error(messages.ERROR.UNAUTHORIZED);

    const product = await Product.findByPk(productId);
    if (!product || !product.isActive) return sendResponse(res, { status: 404, success: false, message: messages.ERROR.NOT_FOUND });

    const exists = await Wishlist.findOne({ where: { userId, productId } });
    if (exists) return sendResponse(res, { status: 400, success: false, message: "Already in wishlist" });

    const item = await Wishlist.create({ userId, productId });
    const wishlistItem = await Wishlist.findByPk(item.id, {
      include: [{ model: Product, as: "product", attributes: ["id", "name", "price", "rating"] }]
    });

    return sendResponse(res, { status: 201, message: "Added to wishlist", data: wishlistItem });
  });

/* ================= GET BY ID ================= */
const getWishlistById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const item = await Wishlist.findOne({
      where: { id },
      include: { model: Product, as: "product", attributes: ["id", "name", "price", "rating"] }
    });
    if (!item) return res.status(404).json({ message: messages.ERROR.NOT_FOUND });
    return res.status(200).json({ success: true, data: item });
  });

/* ================= GET ================= */
const getWishlist = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { count, rows } = await Wishlist.findAndCountAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "price", "discountPrice", "rating"],
          include: [
            {
              model: ProductImage,
              as: "images",
              attributes: ["url"],
              limit: 1
            }
          ]
        }
      ]
    });

    const formatted = rows.map(item => ({
      id: item.id,
      product: {
        ...item.product.toJSON(),
        thumbnail: item.product.images?.[0]?.url
      }
    }));

    return sendResponse(res, {
      message: "Wishlist fetched",
      data: formatted
    });

  });

/* ================= REMOVE ================= */
const removeFromWishlist = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { productId } = req.params;

    // Attempt to delete
    const deletedCount = await Wishlist.destroy({
      where: { userId, productId }
    });

    if (deletedCount === 0) {
      return sendResponse(res, { status: 404, success: false, message: messages.ERROR.NOT_FOUND });
    }

    return sendResponse(res, { message: "Removed from wishlist" });
  });

/* ================= CHECK ================= */
const checkWishlistItem = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { productId } = req.params;
    const exists = await Wishlist.findOne({ where: { userId, productId } });
    return sendResponse(res, { data: { exists: !!exists } });
  });

module.exports = { addToWishlist, getWishlist, removeFromWishlist, checkWishlistItem, getWishlistById };
