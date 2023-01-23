const express = require("express");
const router = express.Router();

const {
  createCategory,
  getAllCategories,
  deleteCategory,
  updateCategory,
  getACategory,
} = require("../controllers/categoryController");

router.post("/", createCategory);
router.get("/", getAllCategories);
router.get("couponId", getACategory);
router.delete("couponId", deleteCategory);
router.patch("couponId", updateCategory);

module.exports = router;
