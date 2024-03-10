const express = require("express");
const router = express.Router();

const { uploadImage, deleteImages } = require("../controllers/imageController");
const {
  uploadPhoto,
  productImageResize,
} = require("../middlewares/uploadImages");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

router.post(
  "/",
  verifyToken,
  isAdmin,
  uploadPhoto.array("images", 10),
  productImageResize,
  uploadImage
);

router.delete("/:id", verifyToken, isAdmin, deleteImages);

module.exports = router;
