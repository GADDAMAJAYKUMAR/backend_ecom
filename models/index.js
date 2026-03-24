const { sequelize } = require('../config/sequelize');



const User = require('./User.model');

// Products
const Category =require("../models/product/Category");
const Product = require("./product/Product");
const ProductVariant = require("../models/product/ProductVariant");
const ProductImage= require("../models/product/ProductImage");
const ProductSpecification = require("./product/ProductSpecification");

// Other models
const Question = require("./Question");
const Review = require("./Review");
const Wishlist = require("./Wishlist");

// Initialize models
const models = {
  User,
  Category,
  Product,
  ProductVariant,
  ProductImage,
  ProductSpecification,
  Question,
  Review,
  Wishlist,
  sequelize
};

// Set up associations here if needed
// Example: User.hasMany(Order);

//Category -> Product
Category.hasMany( Product ,{foreignKey: "categoryId"})
Product.belongsTo(Category,{foreignKey: "categoryId"})


// Product → Images
Product.hasMany(ProductImage, {
  foreignKey: "productId",
  as: "images",
  onDelete: "CASCADE",
  hooks: true,
});
ProductImage.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Product → Specifications (ONE)
Product.hasOne(ProductSpecification, {
  foreignKey: "productId",
  as: "specifications",
  onDelete: "CASCADE",
  hooks: true,
});
ProductSpecification.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Product → Variants
Product.hasMany(ProductVariant, {
  foreignKey: "productId",
  as: "variants",
  onDelete: "CASCADE",
  hooks: true,
});
ProductVariant.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Wishlist associations
Wishlist.belongsTo(Product, { foreignKey: "productId", as: "product" });
Wishlist.belongsTo(User, { foreignKey: "userId", as: "user" });

//Review associations
Review.associate = (models) => {
  Review.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user"
  });

  Review.belongsTo(models.Product, {
    foreignKey: "productId",
    as: "product"
  });
};


// Call associate methods if they exist
if (Question.associate) Question.associate(models);
if (Review.associate) Review.associate(models);

module.exports = models;
