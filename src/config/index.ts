import { CorsOptions } from "cors";
import { DotenvConfigOptions } from "dotenv";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_NAME,
  FRONTEND_URI,
} from "../constants";
import { ConfigOptions } from "cloudinary";
const corsConfig: CorsOptions = {
  credentials: true,
  methods: "GET,POST,PUT,DELETE",
  origin: FRONTEND_URI,
};

const dotenvConfig: DotenvConfigOptions = {
  path: "./.env",
};

const cloudinaryConfig: ConfigOptions = {
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
};

export { corsConfig, dotenvConfig, cloudinaryConfig };
