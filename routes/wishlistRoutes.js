const express = require("express");
const router = express.Router();

const {
  addToWishlist,
  getWishList,
  removeFromWishlist,
} = require("../controllers/wishListController");

router.post("/", addToWishlist);
router.delete("/:wishlistId", removeFromWishlist);
router.get("/", getWishList);
router.get("/:wishlistId", getWishList);

module.exports = router;
