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
router.get("/:wishlistId", getACategory);
router.delete("/:wishlistId", deleteCategory);
router.patch("/:wishlistId", updateCategory);

module.exports = router;
