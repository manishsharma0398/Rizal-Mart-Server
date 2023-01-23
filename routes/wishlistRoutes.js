const express = require("express");
const router = express.Router();

const {
  addToWishlist,
  getWishList,
  removeFromWishlist,
} = require("../controllers/wishListController");

router.post("/", addToWishlist);
router.delete("couponId", removeFromWishlist);
router.get("/", getWishList);
router.get("couponId", getWishList);

module.exports = router;
