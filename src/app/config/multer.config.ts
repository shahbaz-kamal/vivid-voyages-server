import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { CloudinaryUpload } from "./cloudinary.config";

const storage = new CloudinaryStorage({
  cloudinary: CloudinaryUpload,
  params: (req, file) => {
    const parts = file.originalname.split(".");
    parts.pop(); // remove last extension
    const originalName = parts.join("."); // keep rest even if contains dots
    const fileName = originalName
      .toLowerCase()
      .replace(/\s+/g, "-") //replace empty space with -
      .replace(/\./g, "-") //replace . with dash
      // eslint-disable-next-line no-useless-escape
      .replace(/[^a-z0-9\-\.]/g, ""); //removes non alphanumeric value

    const uniqueFileName =
      Math.random().toString(36).substring(2) +
      "-" +
      Date.now() +
      "-" +
      fileName;
    return {
      public_id: uniqueFileName, // 👈 this sets the file name
      resource_type: "auto",
      // keeps extension
    };
  },
});

export const multerUpload = multer({ storage: storage });
