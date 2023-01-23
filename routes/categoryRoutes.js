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
router.get("/:feedbackId", getACategory);
router.delete("/:feedbackId", deleteCategory);
router.patch("/:feedbackId", updateCategory);

module.exports = router;
