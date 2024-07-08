import dotenv from "dotenv";

dotenv.config();

const DB_NAME: string = "mern-blog";
const ENV_MODE = process.env.NODE_ENV?.trim() || "DEVELOPMENT";
const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET!;
const ACCESS_TOKEN_EXPIRY: string = process.env.ACCESS_TOKEN_EXPIRY!;
const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET!;
const REFRESH_TOKEN_EXPIRY: string = process.env.REFRESH_TOKEN_EXPIRY!;
const CLOUDINARY_NAME: string = process.env.CLOUDINARY_NAME!;
const CLOUDINARY_API_KEY: string = process.env.CLOUDINARY_API_KEY!;
const CLOUDINARY_API_SECRET: string = process.env.CLOUDINARY_API_SECRET!;
const PORT: number | string = process.env.PORT! || 2000;
const MONGODB_URI: string = process.env.MONGODB_URI!;
const FRONTEND_URI: string = process.env.FRONTEND_URI!;
const SESSION_SECRET: string = process.env.SESSION_SECRET!;
export {
  DB_NAME,
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_NAME,
  PORT,
  ENV_MODE,
  MONGODB_URI,
  FRONTEND_URI,
  SESSION_SECRET,
};
