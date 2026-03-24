const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");

const Category = sequelize.define("Category", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,

    set(value) {
      this.setDataValue(
        "name",
        value.trim().toLowerCase()
      );
    },

    validate: {
      notEmpty: true
    }
  }

}, {
  tableName: "categories",
  timestamps: true
});

module.exports = Category;
