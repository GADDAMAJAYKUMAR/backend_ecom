// Ensure you have these associations
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/sequelize");
const User = require("./User.model");
const Product = require("./product/Product");

const Question = sequelize.define("Question", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  productId: { type: DataTypes.UUID, allowNull: false },
  userId: { type: DataTypes.UUID, allowNull: false },
  question: { type: DataTypes.TEXT, allowNull: false },
  answer: { type: DataTypes.TEXT },
  answeredBy: { type: DataTypes.UUID }
});


Question.belongsTo(User, { foreignKey: "userId", as: "user" });
Question.belongsTo(User, { foreignKey: "answeredBy", as: "answeredByUser" });
Question.belongsTo(Product, { foreignKey: "productId", as: "product" });

module.exports = Question;
