const express = require("express");
const router = express.Router();

const {
  createCoupon,
  deleteCoupon,
  getCoupon,
  getAllCoupons,
  updateCoupon,
  getCouponsBySeller,
} = require("../controllers/couponController");

router.post("/", createCoupon);
router.delete("couponId", deleteCoupon);
router.get("/all", getAllCoupons);
router.get("/", getCouponsBySeller);
router.get("couponId", getCoupon);
router.put("couponId", updateCoupon);

module.exports = router;
