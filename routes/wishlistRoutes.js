const express = require("express");
const router = express.Router();

const {
  addToWishlist,
  getWishList,
  removeFromWishlist,
} = require("../controllers/wishListController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/", verifyToken, addToWishlist);
router.delete("couponId", verifyToken, removeFromWishlist);
router.get("/", getWishList);

module.exports = router;
