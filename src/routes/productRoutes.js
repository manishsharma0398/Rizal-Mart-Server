const express = require("express");
const router = express.Router();

const {
  addProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
} = require("../controllers/productController");

const { uploadPhoto } = require("../middlewares/uploadImages");

const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

router.post(
  "/",
  verifyToken,
  isAdmin,
  uploadPhoto.array("images", 10),
  addProduct
);
router.get("/", getAllProducts);

router.get("/:productId", getProduct);
router.delete("/:productId", verifyToken, isAdmin, deleteProduct);
router.patch("/:productId", verifyToken, isAdmin, updateProduct);

module.exports = router;
