const { Product, ProductVariant } = require("../models");
const { Op } = require("sequelize");
const messages = require('../constants/messages');
const catchAsync = require('../utils/catchAsync');

// ================= GET VARIANTS BY PRODUCT ID =================
const getVariantsByProduct = catchAsync(async (req, res, next) => {
    const { productId } = req.params;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: messages.ERROR.NOT_FOUND });
    }

    const variants = await ProductVariant.findAll({
      where: { productId },
      attributes: ["id", "color", "stock", "price"]
    });

    if (!variants.length) {
      return res.status(404).json({ success: false, message: messages.ERROR.NOT_FOUND });
    }

    return res.json({ success: true, data: variants });
  });

// ================= SELECT VARIANT BY COLOR =================
const getVariantByColor = catchAsync(async (req, res, next) => {
    const { productId } = req.params;
    const { color } = req.query;

    if (!color) {
      return res.status(400).json({ success: false, message: messages.ERROR.REQUIRED_FIELDS });
    }

    const variant = await ProductVariant.findOne({
      where: {
        productId,
        color: { [Op.iLike]: color } // case-insensitive
      },
      attributes: ["id", "color", "stock", "price"] // removed hexCode
    });

    if (!variant) {
      return res.status(404).json({ success: false, message: messages.ERROR.NOT_FOUND });
    }

    return res.json({ success: true, data: variant });
  });


module.exports = { getVariantsByProduct, getVariantByColor };
