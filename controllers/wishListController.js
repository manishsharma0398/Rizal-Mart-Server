const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const WishList = require("../models/WishList");
const { checkValidMongoId } = require("../utils/validMongoId");

module.exports.addToWishlist = asyncHandler(async (req, res) => {
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

module.exports.removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlistId = req.body?.wishlistId;

  if (!checkValidMongoId(wishlistId))
    return res.status(400).json({ message: "Not valid id" });

  // check if product exist in wishlist for that user
  const deleteWishList = await WishList.findByIdAndDelete(wishlistId).exec();

  if (!deleteWishList)
    return res.status(404).json({ message: "Error WishList Id" });

  return res.status(200).json({ message: "deleted" });
});

module.exports.getWishList = asyncHandler(async (req, res) => {
  const wishList = await WishList.find({ user: req.userId });
  // .select("-__v -createdAt -updatedAt")
  // .exec();
  return res.json(wishList);
});

module.exports.getAWishList = asyncHandler(async (req, res) => {
  const wishlistId = req.params?.wishlistId;
  if (!mongoose.Types.ObjectId.isValid(wishlistId))
    return res.status(400).json({ message: "Invalid ID" });

  const response = await WishList.findById(wishlistId).exec();

  if (!response) return res.status(404).json({ message: "No category Found" });

  return res.json(response);
});
