const mongoose = require("mongoose");
const WishList = require("../models/WishList");
const asyncHandler = require("express-async-handler");
const { checkValidMongoId } = require("../utils/validMongoId");

module.exports.addToWishlist = asyncHandler(async (req, res) => {
  const productId = req.body?.productId;
  const userId = req.userId;

  if (!productId)
    return res.status(400).json({ message: "Product ID required" });

  // check if product exist in wishlist for that user
  let userWishlistProducts = await WishList.findOne({
    user: userId,
  }).exec();

  if (!userWishlistProducts) {
    const newWishList = await (
      await WishList.create({
        user: userId,
        products: [{ product: productId }],
      })
    ).populate("products.product");
    return res.status(201).json(newWishList.products);
  }

  const productExistInWishlist = userWishlistProducts?.products?.filter(
    (product) => product.product.toString() === productId
  );

  if (productExistInWishlist.length > 0) {
    userWishlistProducts.products = userWishlistProducts?.products?.filter(
      (product) => product.product.toString() !== productId
    );
  } else {
    userWishlistProducts.products.push({ product: productId });
  }

  const newData = await (
    await userWishlistProducts.save()
  ).populate("products.product");

  return res.status(201).json(newData.products);
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
  const wishList = await WishList.find({ user: req.userId }).populate(
    "products.product"
  );
  // .select("-__v -createdAt -updatedAt")
  // .exec();
  return res.json(wishList.products);
});

module.exports.getAWishList = asyncHandler(async (req, res) => {
  const wishlistId = req.params?.wishlistId;
  if (!mongoose.Types.ObjectId.isValid(wishlistId))
    return res.status(400).json({ message: "Invalid ID" });

  const response = await WishList.findById(wishlistId).exec();

  if (!response) return res.status(404).json({ message: "No category Found" });

  return res.json(response);
});
