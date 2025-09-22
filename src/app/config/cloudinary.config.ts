import { v2 as cloudinary } from "cloudinary";
import { envVars } from "./env";
import AppError from "../errorHelpers/AppError";
import { resolve } from "path";
import stream from "stream";

cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUD_NAME,
  api_key: envVars.CLOUDINARY.API_KEY,
  api_secret: envVars.CLOUDINARY.API_SECRET,
});

export const uploadBufferToCloudinary = async (
  buffer: Buffer,
  fileName: string
) => {
  try {
    return new Promise((resolve, reject) => {
      const public_id = `pdf/${fileName}-${Date.now()}`;
      const bufferStream = new stream.PassThrough();
      bufferStream.end(buffer);
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
            public_id,
            folder: "pdf",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        )
        .end(buffer);
    });
  } catch (error) {
    console.log(error);
    throw new AppError(401, "Error in uploading to cloudinary");
  }
};

export const deleteFromCloudinary = async (url: string) => {
  try {
    const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|webp|gif)$/i;
    const match = url.match(regex);
    if (match && match[1]) {
      const public_id = match[1];
      await cloudinary.uploader.destroy(public_id);
      console.log(`File ${public_id} is deleted from cloudinary`);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    throw new AppError(401, "Cloudinary image deletion failed", error.message);
  }
};

export const CloudinaryUpload = cloudinary;
