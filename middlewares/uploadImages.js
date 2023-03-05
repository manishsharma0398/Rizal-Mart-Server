const fs = require("fs");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fsPromises = require("fs").promises;

const asyncHandler = require("express-async-handler");

const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../config/cloudinary");

const makeFolder = async (folder) => {
  if (!fs.existsSync(path.join(__dirname, "..", "public", folder))) {
    try {
      await fsPromises.mkdir(path.join(__dirname, "..", "public", folder), {
        recursive: true,
      });
    } catch (error) {
      throw error;
    }
  }
  return path.join(__dirname, "..", "public", folder);
};

const multerStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    cb(null, await makeFolder("images"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e24);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

module.exports.uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fieldSize: 2 * 1024 * 1024 },
});

module.exports.compressImage = async (file) => {
  console.log("first");
  if (!file) return null;
  console.log("here");
  await makeFolder("compressedImages");
  console.log("error here");
  await sharp(file?.path)
    // .resize(300, 300)
    .toFormat("jpeg")
    .jpeg({ quality: 50 })
    .toFile(
      path.join(
        __dirname,
        "..",
        "public",
        "compressedImages",
        `${file?.filename}`
      )
    );

  return path.join(
    __dirname,
    "..",
    "public",
    "compressedImages",
    `${file?.filename}`
  );
};

module.exports.uploadImages = async (files) => {
  try {
    const urls = [];

    for (const file of files) {
      const originalImage = file.path;
      // const compressedImage = await compressImage(file);

      const newPath = await cloudinaryUploadImg(originalImage, "rizal-mart");

      urls.push(newPath);

      // fs.closeSync(fs.openSync(originalImage, "r"));
      // fs.closeSync(fs.openSync(compressedImage, "r"));

      // fs.unlinkSync(compressedImage);
      fs.unlinkSync(originalImage);
    }

    const images = urls.map((file) => {
      return file;
    });

    return images;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports.deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = cloudinaryDeleteImg(id, "images");
    res.json({ message: "Deleted" });
  } catch (error) {
    throw new Error(error);
  }
});
