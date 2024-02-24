import dotenv from "dotenv";
import { dotenvConfig } from "../config";
dotenv.config(dotenvConfig);

const DB_NAME: string = "mern-blog-graphql";
const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET || "";
const ACCESS_TOKEN_EXPIRY: string = process.env.ACCESS_TOKEN_EXPIRY || "";
const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET || "";
const REFRESH_TOKEN_EXPIRY: string = process.env.REFRESH_TOKEN_EXPIRY || "";
const PORT: number | string = process.env.PORT! || 4000;
const MONGODB_URI: string = process.env.MONGODB_URI!;
const FRONTEND_URI:string = process.env.FRONTEND_URI!

export {
  DB_NAME,
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  PORT,
  MONGODB_URI,
  FRONTEND_URI
};
