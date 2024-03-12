const express = require("express");
const router = express.Router();

const {
  createCategory,
  getAllCategories,
  deleteCategory,
  updateCategory,
  getACategory,
} = require("../controllers/categoryController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

router.post("/", verifyToken, isAdmin, createCategory);
router.get("/", getAllCategories);
router.get("/:categoryId", getACategory);
router.delete("/:categoryId", verifyToken, isAdmin, deleteCategory);
router.patch("/:categoryId", verifyToken, isAdmin, updateCategory);

module.exports = router;
