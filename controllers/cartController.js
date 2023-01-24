const asyncHandler = require("express-async-handler");

const Cart = require("../models/Cart");
const Product = require("../models/Product");
const {
  checkValidMongoId,
  isValidProductId,
} = require("../utils/validMongoId");

module.exports.addToCart = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const productId = req.body?.product;
  isValidProductId(productId);

  const product = await Product.findById(productId).select("price").exec();

  if (!product) return res.status(400).json({ message: "Product Not Found" });

  // check if user cart exist
  const cartExist = await Cart.findOne({
    user: userId,
  }).exec();

  const newProduct = {
    product: product._id,
    count: 1,
  };

  //   user cart is totally empty
  if (!cartExist) {
    const newCart = await Cart.create({
      products: [{ ...newProduct }],
      user: userId,
    });
    return res.status(201).json(newCart);
  }

  const productExistInCart = cartExist.products.filter(
    (product) => product.product.toString() === productId
  );

  if (productExistInCart.length > 0) {
    productExistInCart[0].count += 1;
  } else {
    cartExist.products.push(newProduct);
  }

  await cartExist.save();
  return res.json(cartExist);
});

// done
module.exports.removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const productId = req.body?.product;
  const cartId = req.params?.cartId;
  //   isValidProductId(cartId);

  const product = await Product.findById(productId).select("price").exec();

  if (!product) return res.status(400).json({ message: "Product Not Found" });

  // check if user cart exist
  const cartExist = await Cart.findById(cartId).exec();

  //   user don't have cart
  if (!cartExist) return res.status(400).json({ message: "Cart Empty" });

  const productExistInCart = cartExist.products.filter(
    (product) => product.product.toString() === productId
  );

  if (!productExistInCart.length)
    return res
      .status(400)
      .json({ message: "This product does not exist in user cart" });

  //   if count is 1 remove from cart
  if (productExistInCart[0].count === 1) {
    cartExist.products = cartExist.products.filter(
      (product) => product.product.toString() !== productId
    );
  } else {
    productExistInCart[0].count -= 1;
    productExistInCart[0].price = product.price;
  }

  cartExist.total = cartExist.products.reduce(
    (total, val) => total + val.count * val.price,
    0
  );
  await cartExist.save();
  return res.json(cartExist);
});

// get cart items for a user
module.exports.getCartItems = asyncHandler(async (req, res) => {
  const userId = req?.userId;
  if (!checkValidMongoId(userId))
    return res.status(400).json({ message: "Invalid ID" });

  const cartItems = await Cart.findOne({ user: userId })
    .populate([
      {
        path: "products.product",
        select: "price title images",
      },
      {
        path: "couponApplied",
        select: "expiry name discount _id",
      },
    ])
    .exec();

  if (!cartItems) return res.status(404).json({ message: "No category Found" });

  return res.json(cartItems);
});
