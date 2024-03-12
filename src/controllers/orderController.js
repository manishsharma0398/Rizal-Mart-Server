const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Profile = require("../models/Profile");
const { checkValidMongoId } = require("../utils/validMongoId");

module.exports.getAddressOfUser = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const addresss = await Profile.findOne({ user: userId });
  return res.json(addresss);
});

module.exports.addNewAddress = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const userData = req.body;

  const data = await Profile.findOne({ user: userId });

  if (data === null) {
    const newData = await Profile.create({
      user: userId,
      addresses: [
        {
          ...userData,
        },
      ],
    });
    return res.status(201).json(newData);
  }

  const newData = await Profile.findOneAndUpdate(
    { user: userId },
    { $push: { addresses: userData } },
    { new: true }
  );

  return res.status(201).json(newData);
});

module.exports.createNewOrder = asyncHandler(async (req, res) => {
  const data = req.body;
  res.json(data);

  // var options = {
  //   amount: 50000,
  //   currency: "INR",
  //   receipt: "order_rcptid_11"
  // };
  // instance.orders.create(options, function(err, order) {
  //   console.log(order);
  // });

  // const productId = req.body?.productId;
  // const userId = req.userId;
  // if (!productId)
  //   return res.status(400).json({ message: "Product ID required" });
  // // check if product exist in wishlist for that user
  // const productExist = await WishList.findOne({
  //   product: productId,
  //   user: userId,
  // }).exec();
  // if (productExist)
  //   return res.status(400).json({ message: "Product already in wishlist" });
  // const newWishList = await WishList.create({
  //   product: productId,
  //   user: userId,
  // });
  // return res.status(201).json(newWishList);
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
