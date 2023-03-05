require("dotenv").config();
const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload
module.exports.cloudinaryUploadImg = async (fileToUploads, folder) => {
  const response = await cloudinary.uploader.upload(fileToUploads, { folder });
  return {
    url: response.secure_url,
    asset_id: response.asset_id,
    public_id: response.public_id,
  };
};

// Delete
module.exports.cloudinaryDeleteImg = async (fileToDelete) => {
  const response = await cloudinary.uploader.destroy(fileToDelete);
  return {
    url: response.secure_url,
    asset_id: response.asset_id,
    public_id: response.public_id,
  };
};
