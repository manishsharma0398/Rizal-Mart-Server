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
router.get("/:categoryId", getACategory);
router.delete("/:categoryId", deleteCategory);
router.patch("/:categoryId", updateCategory);

module.exports = router;
