const express = require("express");
const router = express.Router();

const {
  addToCart,
  removeFromCart,
  getCartItems,
} = require("../controllers/cartController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/", verifyToken, addToCart);
router.post("/:cartId", verifyToken, removeFromCart);
router.get("/", verifyToken, getCartItems);

module.exports = router;
