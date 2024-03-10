const asyncHandler = require("express-async-handler");

const Cart = require("../models/Cart");
const Product = require("../models/Product");
const {
  checkValidMongoId,
  isValidProductId,
} = require("../utils/validMongoId");

module.exports.addToCart = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const productId = req.body?.productId;
  const productQuantity = req.body?.quantity;

  isValidProductId(productId);

  const product = await Product.findById(productId).select("price").exec();

  if (!product) return res.status(400).json({ message: "Product Not Found" });

  // check if user cart exist
  const cartExist = await Cart.findOne({
    user: userId,
  }).exec();

  const newProduct = {
    product: product._id,
    count: productQuantity,
  };

  //   user cart is totally empty
  if (!cartExist) {
    const newCart = await Cart.create({
      products: [{ ...newProduct }],
      user: userId,
    });
    return res.status(201).json(newCart);
  }

  const productExistInCart = cartExist?.products?.filter(
    (product) => product.product._id.toString() === productId
  );

  if (productExistInCart.length > 0) {
    productExistInCart[0].count = productQuantity;
  } else {
    cartExist.products.push(newProduct);
  }

  const d = await (await cartExist.save()).populate("products.product");

  return res.json(d.products);
  // return res.json(cartExist.products);
});

// done
module.exports.removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const cartItemId = req.params?.cartId;

  // check if user cart exist
  const cart = await Cart.findOne({ user: userId })
    .populate("products.product")
    .exec();

  // user don't have cart
  if (!cart) return res.status(400).json({ message: "Cart Empty" });

  const newCart = cart.products.filter(
    (product) => product._id.toString() !== cartItemId
  );

  cart.products = newCart;

  await cart.save();
  return res.status(200).json(cart.products);
});

// get cart items for a user
module.exports.getCartItems = asyncHandler(async (req, res) => {
  const userId = req?.userId;

  if (!checkValidMongoId(userId))
    return res.status(400).json({ message: "Invalid ID" });

  let cartItems = await Cart.findOne({ user: userId })
    .populate("products.product")
    .exec();

  if (!cartItems) cartItems = [];
  if (cartItems) cartItems = cartItems?.products;

  return res.json(cartItems);
});
