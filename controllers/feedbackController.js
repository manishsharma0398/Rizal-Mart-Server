const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const Feedback = require("../models/Feedback");
const { checkValidMongoId } = require("../utils/validMongoId");

module.exports.createFeedback = asyncHandler(async (req, res) => {
  const productId = req.body?.productId;
  const rating = req.body?.rating;
  const feedback = req.body?.feedback;
  const userId = req?.userId;

  if (!productId || !rating || !feedback)
    return res.status(400).json({ message: "All fields required" });

  // check if product exist in wishlist for that user
  const feedbackExist = await WishList.findOne({
    product: productId,
    user: userId,
  }).exec();

  if (feedbackExist)
    return res
      .status(400)
      .json({ message: "One Product One User One feedback" });

  const newFeedback = await Feedback.create({
    product: productId,
    user: userId,
    rating,
    feedback,
  });
  return res.status(201).json(newFeedback);
});

module.exports.getAllFedback = asyncHandler(async (req, res) => {
  const productId = req.params?.productId;
  if (!mongoose.Types.ObjectId.isValid(productId))
    return res.status(400).json({ message: "Invalid ID" });
  const allFeedbacks = await Feedback.find({ product: productId })
    .select("-__v -createdAt -updatedAt")
    .exec();
  return res.json(allFeedbacks);
});

module.exports.getFeedback = asyncHandler(async (req, res) => {
  const feedbackId = req.params?.feedbackId;
  if (!mongoose.Types.ObjectId.isValid(feedbackId))
    return res.status(400).json({ message: "Invalid ID" });

  const response = await Feedback.findById(feedbackId).exec();

  if (!response) return res.status(404).json({ message: "No Feedback Found" });

  return res.json(response);
});

module.exports.updateFeedback = asyncHandler(async (req, res) => {
  const feedbackId = req.params?.feedbackId;
  const rating = req.body?.rating;
  const feedback = req.body?.feedback;
  const userId = req?.userId;

  if (!rating || !feedback)
    return res.status(400).json({ message: "All fields required" });

  if (!checkValidMongoId(feedbackId))
    return res.status(400).json({ message: "Not valid id" });

  // check for duplicate
  const updatedFeedback = await Feedback.findByIdAndUpdate(feedbackId, {
    rating: Number(rating),
    feedback,
  }).exec();

  if (!updatedFeedback) throw new Error(err);

  return res.status(200).json(updatedFeedback);
});

module.exports.deleteFeedback = asyncHandler(async (req, res) => {
  const feedbackId = req.params?.feedbackId;

  if (!checkValidMongoId(feedbackId))
    return res.status(400).json({ message: "Not valid id" });

  // check if product exist in feedback for that user
  const deleteFeedback = await Feedback.findByIdAndDelete(feedbackId).exec();

  if (!deleteFeedback)
    return res.status(404).json({ message: "Error Feedback Id" });

  return res.status(200).json({ message: "deleted" });
});
