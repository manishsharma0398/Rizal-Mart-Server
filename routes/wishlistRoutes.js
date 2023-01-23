const express = require("express");
const router = express.Router();

const {
  addToWishlist,
  getWishList,
  removeFromWishlist,
} = require("../controllers/wishListController");

router.post("/", addToWishlist);
router.delete("/:feedbackId", removeFromWishlist);
router.get("/", getWishList);
router.get("/:feedbackId", getWishList);

module.exports = router;
