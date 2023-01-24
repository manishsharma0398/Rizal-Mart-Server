const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const Coupon = require("../models/Coupon");
const Cart = require("../models/Cart");
const { checkValidMongoId, isValidCoupon } = require("../utils/validMongoId");

module.exports.createCoupon = asyncHandler(async (req, res) => {
  const name = req.body?.name;
  const expiry = req.body?.expiry;
  const discount = req.body?.discount;
  const user = req?.userId;

  if (!name || !expiry || !discount)
    return res.status(400).json({ message: "All fields required" });

  const couponExist = await Coupon.findOne({
    name,
  }).exec();

  if (couponExist)
    return res.status(400).json({ message: "This coupon already exist" });

  const newCoupon = await Coupon.create({ ...req.body, user });
  return res.status(201).json(newCoupon);
});

module.exports.getAllCoupons = asyncHandler(async (req, res) => {
  const allCoupons = await Coupon.find({}).exec();
  // .select("-__v -createdAt -updatedAt")
  return res.json(allCoupons);
});

module.exports.getCouponsBySeller = asyncHandler(async (req, res) => {
  const sellerId = req.userId;
  const allCoupons = await Coupon.find({ user: sellerId }).exec();
  // .select("-__v -createdAt -updatedAt")
  return res.json(allCoupons);
});

module.exports.getCoupon = asyncHandler(async (req, res) => {
  const couponId = req.params?.couponId;
  if (!mongoose.Types.ObjectId.isValid(couponId))
    return res.status(400).json({ message: "Invalid ID" });

  const response = await Coupon.findById(couponId).exec();

  if (!response) return res.status(404).json({ message: "Coupon Not Found" });

  return res.json(response);
});

module.exports.updateCoupon = asyncHandler(async (req, res) => {
  const couponId = req.params.couponId;
  const name = req.body?.name;
  const expiry = req.body?.expiry;
  const discount = req.body?.discount;

  // if (!name || !expiry || !discount)
  //   return res.status(400).json({ message: "All fields required" });

  if (!checkValidMongoId(couponId))
    return res.status(400).json({ message: "Not valid id" });

  // check for duplicate
  const couponExist = await Coupon.findOne({ name }).exec();

  if (couponExist)
    return res.status(400).json({ message: "Coupon already exis" });

  const updatedCoupon = await Coupon.findByIdAndUpdate(
    couponId,
    {
      name,
      expiry,
      discount,
    },
    { new: true }
  ).exec();

  if (!updatedCoupon) throw new Error(err);

  return res.status(200).json(updatedCoupon);
});

module.exports.deleteCoupon = asyncHandler(async (req, res) => {
  const couponId = req.params?.couponId;

  if (!checkValidMongoId(couponId))
    return res.status(400).json({ message: "Not valid id" });

  // check if product exist in feedback for that user
  const deleteCoupon = await Coupon.findByIdAndDelete(couponId).exec();

  if (!deleteCoupon)
    return res.status(404).json({ message: "Error Coupon Id" });

  return res.status(200).json({ message: "deleted" });
});

module.exports.applyCoupon = asyncHandler(async (req, res) => {
  const coupon = req.body.coupon;

  const couponExist = await Coupon.findOne({ name: coupon }).exec();

  if (!couponExist)
    return res.status(400).json({ message: "Coupon does not exist" });

  if (Date.now() > new Date(couponExist.expiry))
    return res.status(400).json({ message: "Coupon expired" });

  const cart = await Cart.findOne({ user: req.userId }).exec();

  if (!cart) return res.json({ message: "No cart" });

  if (!cart.products.length) return res.json({ message: "No Item to apply" });

  cart.couponApplied = couponExist._id;
  await cart.save();
  return res.json(cart);
});
