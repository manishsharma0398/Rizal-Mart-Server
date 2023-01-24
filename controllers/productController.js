const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const fs = require("fs");

const Product = require("../models/Product");
const { isValidProductId } = require("../utils/validMongoId");
const { cloudinaryUploadImg } = require("../config/cloudinary");

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

module.exports.uploadProductImage = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  isValidProductId(productId);

  const urls = [];
  const files = req.files;

  for (const file of files) {
    const originalImage = file.path;
    const compressedImage = file.path.replace(
      "\\public\\images",
      "\\public\\images\\products"
    );
    const newPath = await cloudinaryUploadImg(compressedImage, "images");
    urls.push(newPath);
    fs.unlinkSync(originalImage);
    fs.unlinkSync(compressedImage);
  }

  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      { images: urls.map((file) => file) },
      { new: true }
    ).exec();

    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});
