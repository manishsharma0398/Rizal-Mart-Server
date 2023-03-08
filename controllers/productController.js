const asyncHandler = require("express-async-handler");
const fs = require("fs");

const Product = require("../models/Product");
const Category = require("../models/Category");

const { isValidProductId } = require("../utils/validMongoId");
const { uploadImages, compressImage } = require("../middlewares/uploadImages");
const {
  cloudinaryDeleteImg,
  cloudinaryUploadImg,
} = require("../config/cloudinary");
const { default: mongoose } = require("mongoose");

module.exports.addProduct = asyncHandler(async (req, res) => {
  const files = req?.files;
  const productData = req?.body;

  const images = [];

  for (const file of files) {
    const originalImage = file?.path;
    const compressedImage = await compressImage(file);

    const newPath = await cloudinaryUploadImg(compressedImage, "rizal-mart");

    images.push(newPath);

    fs.closeSync(fs.openSync(originalImage, "r"));
    fs.closeSync(fs.openSync(compressedImage, "r"));

    fs.unlinkSync(originalImage);
    fs.unlinkSync(compressedImage);
  }

  // const uploadedImagesUrl = await uploadImages(req?.files);
  // const newProduct = req.body;
  // console.log(uploadedImagesUrl);

  const newProduct = await Product.create({
    ...productData,
    seller: req.userId,
    images,
  });

  // return res.status(201).json("productCreated");
  return res.status(201).json(newProduct);
});

module.exports.getProduct = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  isValidProductId(productId);

  const product = await Product.findById(productId).populate("category").exec();
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

  const product = await Product.findById(productId).exec();
  if (!product) return res.status(404).json({ message: "Product not found" });

  for (let i = 0; i < product?.images.length; i++) {
    const image = product?.images[i];
    console.log(image);
    await cloudinaryDeleteImg(image?.public_id);
  }

  const deleteProduct = await Product.deleteOne({ _id: productId });

  if (!deleteProduct)
    return res.status(400).json({
      message: "Cannot delete product please try again later",
    });

  return res.json({ message: "Product Deleted", id: product._id });
});

module.exports.getAllProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) - 1 || 0;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.search || "";
  let sort = req.query.sort || "title";
  let sortOrder = req.query.sortOrder || "asc";
  let categoryToFilter = req.query.categories || "All";
  const featured = req.query.featured || false;
  const popular = req.query.popular || false;
  const banner = req.query.banner || false;

  console.log(banner);

  const categoriesFromDB = await Category.find({}).exec();

  let categoryIds = [];

  if (categoryToFilter === "All") {
    categoryIds = categoriesFromDB.map((cat) => cat._id);
  } else {
    const categories = categoryToFilter.split(",");
    categoryIds = categories.filter((cat) =>
      mongoose.Types.ObjectId.isValid(cat)
    );
  }

  const query = {
    title: { $regex: search, $options: "i" },
    category: { $in: categoryIds },
  };

  if (featured) query.featured = true;
  if (popular) query.popular = true;
  if (banner) query.showBanner = true;

  const allProducts = await Product.find(query)
    .sort({ [sort]: sortOrder })
    .skip(page * limit)
    .limit(limit)
    .populate("category")
    // .populate([{ path: "user", select: "name profilePic email" }])
    // .populate([{ path: "category", select: "category" }])
    .exec();

  return res.status(200).json(allProducts);
});
