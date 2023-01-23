const asyncHandler = require("express-async-handler");

const Category = require("../models/Category");
const { logEvents } = require("../middlewares/logger");
const { isValidId } = require("../utils/validMongoId");
const { default: mongoose } = require("mongoose");

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
  const category = req.body?.category;
  if (!category) return res.status(400).json({ message: "Field required" });

  // check for duplicate
  const categoryExist = await Category.findOne({ category }).exec();

  if (categoryExist)
    return res.status(400).json({ message: "Category already exist" });

  categoryExist.category = category;
  await categoryExist.save();

  return res
    .status(200)
    .json({ id: categoryExist._id, category: categoryExist.category });
});

module.exports.deleteCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params?.categoryId;
  if (!mongoose.Types.ObjectId.isValid(categoryId))
    return res.status(400).json({ message: "Invalid ID" });

  const response = await Category.findByIdAndDelete(categoryId).exec();

  if (!response) return res.status(404).json({ message: "No category Found" });

  return res.json({ message: `Category ${response.category} deleted` });
});

module.exports.getACategory = asyncHandler(async (req, res) => {
  const categoryId = req.params?.categoryId;
  if (!mongoose.Types.ObjectId.isValid(categoryId))
    return res.status(400).json({ message: "Invalid ID" });

  const response = await Category.findById(categoryId).exec();

  if (!response) return res.status(404).json({ message: "No category Found" });

  return res.json(response);
});
