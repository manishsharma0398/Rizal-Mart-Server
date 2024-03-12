import "dotenv/config";
import { ConfigOptions, UploadApiResponse, v2 as cloudinary } from "cloudinary";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
}) as ConfigOptions;

interface ImageResponse {
  url: string;
  asset_id: string;
  public_id: string;
}

// Upload
const cloudinaryUploadImg: (
  fileToUploads: string,
  folder: string
) => Promise<ImageResponse> = async (fileToUploads, folder) => {
  const response: UploadApiResponse = await cloudinary.uploader.upload(
    fileToUploads,
    { folder }
  );
  return {
    url: response.secure_url,
    asset_id: response.asset_id,
    public_id: response.public_id,
  };
};

// Delete
const cloudinaryDeleteImg: (
  fileToUploads: string,
  folder: string
) => Promise<ImageResponse> = async (fileToDelete: string) => {
  const response = await cloudinary.uploader.destroy(fileToDelete);
  return {
    url: response.secure_url,
    asset_id: response.asset_id,
    public_id: response.public_id,
  };
};

export const CloudinaryServices = { cloudinaryDeleteImg, cloudinaryUploadImg };
