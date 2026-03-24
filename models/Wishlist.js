const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/sequelize");

const Wishlist = sequelize.define(
  "Wishlist",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  },
  {
    tableName: "wishlist",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "productId"] // prevent duplicates
      }
    ]
  }
);

module.exports = Wishlist;
