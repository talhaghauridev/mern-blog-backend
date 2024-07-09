import { CorsOptions } from "cors";
import { DotenvConfigOptions } from "dotenv";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_NAME,
  FRONTEND_URI,
  SESSION_SECRET,
} from "../constants/env";
import { ConfigOptions } from "cloudinary";
import compressionMiddleware from "compression";
import { SessionOptions } from "express-session";
import { HelmetOptions } from "helmet";
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

const session: SessionOptions = {
  secret: SESSION_SECRET,
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  },
  saveUninitialized: false,
};

const helmet: HelmetOptions = {
  contentSecurityPolicy: false,
};
export const config = {
  cors,
  dotenv,
  cloudinary,
  compression,
  session,
  helmet,
};
