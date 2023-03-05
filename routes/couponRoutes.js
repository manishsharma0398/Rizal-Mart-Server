const express = require("express");
const router = express.Router();

const {
  createCoupon,
  deleteCoupon,
  getCoupon,
  getAllCoupons,
  updateCoupon,
  getCouponsBySeller,
  applyCoupon,
} = require("../controllers/couponController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/", verifyToken, createCoupon);
router.delete("/:couponId", verifyToken, deleteCoupon);
router.get("/all", getAllCoupons);
router.get("/", verifyToken, getCouponsBySeller);
router.get("/:couponId", getCoupon);
router.put("/:couponId", verifyToken, updateCoupon);
router.post("/apply", verifyToken, applyCoupon);

module.exports = router;
