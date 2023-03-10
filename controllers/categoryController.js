const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const Category = require("../models/Category");

module.exports.createCategory = asyncHandler(async (req, res) => {
  const category = req.body?.category;
  if (!category)
    return res.status(400).json({ message: "Category cannot be empty" });

  // check for duplicate
  const categoryExist = await Category.findOne({ category }).exec();

  if (categoryExist)
    return res.status(400).json({ message: "Category already exist" });

  const newCategory = await Category.create(req.body);
  return res.status(201).json(newCategory);
});

module.exports.getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({})
    .select("-__v -createdAt -updatedAt")
    .exec();
  return res.json(categories);
});

module.exports.updateCategory = asyncHandler(async (req, res) => {
  const categoryId = req?.params?.categoryId;
  const category = req.body?.category;

  if (!category) return res.status(400).json({ message: "Field required" });

  // check for duplicate
  const categoryExist = await Category.findOne({ category }).exec();

  if (categoryExist && categoryExist?._id.toString() !== categoryId)
    return res.status(400).json({ message: "Category already exist" });

  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    {
      category,
    },
    { new: true }
  ).exec();

  if (!updatedCategory) throw new Error(err);

  return res.status(200).json(updatedCategory);
});

module.exports.deleteCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params?.categoryId;
  if (!mongoose.Types.ObjectId.isValid(categoryId))
    return res.status(400).json({ message: "Invalid ID" });

  const response = await Category.findByIdAndDelete(categoryId).exec();

  if (!response) return res.status(404).json({ message: "No category Found" });

  return res.json({
    message: `Category ${response.category} deleted`,
    id: response._id,
  });
});

module.exports.getACategory = asyncHandler(async (req, res) => {
  const categoryId = req.params?.categoryId;
  if (!mongoose.Types.ObjectId.isValid(categoryId))
    return res.status(400).json({ message: "Invalid ID" });

  const response = await Category.findById(categoryId).exec();

  if (!response) return res.status(404).json({ message: "No category Found" });

  return res.json(response);
});
