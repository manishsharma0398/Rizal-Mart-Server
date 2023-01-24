require("dotenv").config();
const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload
module.exports.cloudinaryUploadImg = async (fileToUpload) => {
  try {
    const res = await cloudinary.uploader.upload(fileToUpload);
    // console.log(res);
    return res.secure_url;
  } catch (error) {
    throw new Error(error);
  }
};
