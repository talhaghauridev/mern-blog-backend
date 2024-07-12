import { ConfigOptions } from "cloudinary";
import compressionMiddleware from "compression";
import { CorsOptions } from "cors";
import { DotenvConfigOptions } from "dotenv";
import { HelmetOptions } from "helmet";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_NAME,
  FRONTEND_URI,
} from "../constants/env";
const cors: CorsOptions = {
  credentials: true,
  origin: [FRONTEND_URI, "*"],
};

const dotenv: DotenvConfigOptions = {
  path: "./.env",
};

const cloudinary: ConfigOptions = {
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
};

const compression: compressionMiddleware.CompressionOptions = {
  level: 6,
  filter: (req, res) => {
    if (req.headers["x-no-compression"]) {
      return false;
    }
    return compressionMiddleware.filter(req, res);
  },
};

const helmet: HelmetOptions = {
  contentSecurityPolicy: false,
};
export const config = {
  cors,
  dotenv,
  cloudinary,
  compression,
  helmet,
};
