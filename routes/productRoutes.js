const express = require("express");
const router = express.Router();

const {
  addProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
} = require("../controllers/productController");

router.post("/", addProduct);
router.get("/", getAllProducts);
router.get("/:productId", getProduct);
router.delete("/:productId", deleteProduct);
router.patch("/:productId", updateProduct);

module.exports = router;
