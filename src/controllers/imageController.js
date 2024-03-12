const fs = require("fs");
const asyncHandler = require("express-async-handler");

const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../config/cloudinary");

module.exports.uploadImage = asyncHandler(async (req, res) => {
  try {
    const urls = [];
    const files = req.files;

    for (const file of files) {
      const originalImage = file.path;
      // const compressedImage = file.path.replace(
      //   "\\public\\images",
      //   "\\public\\images\\compressed"
      // );

      // const compressedImage = awa

      const newPath = await cloudinaryUploadImg(compressedImage, "images");
      urls.push(newPath);
      fs.unlinkSync(originalImage);
      fs.unlinkSync(compressedImage);
    }

    const images = urls.map((file) => {
      return file;
    });
    res.json(images);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports.deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = cloudinaryDeleteImg(id, "images");
    res.json({ message: "Deleted" });
  } catch (error) {
    throw new Error(error);
  }
});
