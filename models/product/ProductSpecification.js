const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");

const ProductSpecification = sequelize.define("ProductSpecification", {
 
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  material: {
    type: DataTypes.STRING
  },

  legMaterial: {
    type: DataTypes.STRING
  },

  weightCapacity: {
    type: DataTypes.STRING
  },

  seatHeight: {
    type: DataTypes.STRING
  },

  totalHeight: {
    type: DataTypes.STRING
  }

}, {
  tableName: "product_specifications",
  timestamps: true
});

module.exports = ProductSpecification;
