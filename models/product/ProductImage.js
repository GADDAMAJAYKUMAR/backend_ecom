const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");

const ProductImage = sequelize.define("ProductImage", {

  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Image URL cannot be empty"
      }
    }
  }

}, {
  tableName: "product_images",
  timestamps: true
});

module.exports = ProductImage;
