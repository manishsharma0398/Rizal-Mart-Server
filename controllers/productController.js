const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const Product = require("../models/Product");
const { isValidProductId } = require("../utils/validMongoId");

module.exports.addProduct = asyncHandler(async (req, res) => {
  const newProduct = req.body;

  if (req.body.title) req.body.slug = slugify(req.body.title);

  const productCreated = await Product.create(newProduct);

  return res.status(201).json(productCreated);
});

module.exports.getProduct = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  isValidProductId(productId);

  const product = await Product.findById(productId).exec();
  if (!product) {
    res.statusCode = 404;
    return res.json({ message: "Product not found" });
  }

  return res.status(201).json(product);
});

module.exports.updateProduct = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  isValidProductId(productId);

  try {
    if (req.body.title) req.body.slug = slugify(req.body.title);
    const product = await Product.findByIdAndUpdate(productId, req.body, {
      new: true,
    }).exec();
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.json(product);
  } catch (error) {
    res.statusCode = 400;
    return res.json({
      message: "Cannot update product please try again later",
    });
  }
});

module.exports.deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  isValidProductId(productId);

  try {
    const product = await Product.findByIdAndDelete(productId).exec();
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.json({ message: "Product Deleted" });
  } catch (error) {
    res.statusCode = 400;
    return res.json({
      message: "Cannot delete product please try again later",
    });
  }
});

module.exports.getAllProducts = asyncHandler(async (req, res) => {
  // ! sorting, filtering, searching look before 3:37

  const queryObj = { ...req.query };

  console.log(queryObj);

  // const products = await Product.find(req);

  return res.json(queryObj);
});
