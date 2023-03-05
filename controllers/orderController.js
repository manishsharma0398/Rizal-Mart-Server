const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const Order = require("../models/Order");
const { checkValidMongoId } = require("../utils/validMongoId");

module.exports.createNewOrder = asyncHandler(async (req, res) => {
  const productId = req.body?.productId;
  const userId = req.userId;

  if (!productId)
    return res.status(400).json({ message: "Product ID required" });

  // check if product exist in wishlist for that user
  const productExist = await WishList.findOne({
    product: productId,
    user: userId,
  }).exec();

  if (productExist)
    return res.status(400).json({ message: "Product already in wishlist" });

  const newWishList = await WishList.create({
    product: productId,
    user: userId,
  });
  return res.status(201).json(newWishList);
});

module.exports.deleteOrder = asyncHandler(async (req, res) => {
  const orderId = req.body?.orderId;

  if (!checkValidMongoId(orderId))
    return res.status(400).json({ message: "Not valid id" });

  // check if product exist in wishlist for that user
  const isOrderDeleted = await Order.findByIdAndDelete(orderId).exec();

  if (!isOrderDeleted)
    return res.status(404).json({ message: "Error Order Id" });

  return res.status(204).json();
});

module.exports.updateOrder = asyncHandler(async (req, res) => {
  const wishList = await WishList.find({ user: req.userId });
  // .select("-__v -createdAt -updatedAt")
  // .exec();
  return res.json(wishList);
});

module.exports.getOrder = asyncHandler(async (req, res) => {
  const wishlistId = req.params?.wishlistId;
  if (!mongoose.Types.ObjectId.isValid(wishlistId))
    return res.status(400).json({ message: "Invalid ID" });

  const response = await WishList.findById(wishlistId).exec();

  if (!response) return res.status(404).json({ message: "No category Found" });

  return res.json(response);
});

module.exports.getAllOrders = asyncHandler(async (req, res) => {
  const response = await Order.find({}).exec();

  if (!response) res.statusCode = 404;

  return res.json({ data: response });
});
