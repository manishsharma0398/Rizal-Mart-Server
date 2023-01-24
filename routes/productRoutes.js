const express = require("express");
const router = express.Router();

const {
  addProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  uploadProductImage,
} = require("../controllers/productController");
const {
  uploadPhoto,
  productImageResize,
} = require("../middlewares/uploadImages");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/", verifyToken, addProduct);
router.get("/", getAllProducts);
router.put(
  "/upload/:productId",
  verifyToken,
  uploadPhoto.array("images", 10),
  productImageResize,
  uploadProductImage
);
router.get("/:productId", getProduct);
router.delete("/:productId", deleteProduct);
router.patch("/:productId", updateProduct);

module.exports = router;
