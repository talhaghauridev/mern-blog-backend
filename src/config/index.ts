import { CorsOptions } from "cors";
import { DotenvConfigOptions } from "dotenv";
import { FRONTEND_URI } from "../constants";

const corsConfig: CorsOptions = {
  credentials: true,
  methods: "GET,POST,PUT,DELETE",
  origin: FRONTEND_URI,
};

const dotenvConfig: DotenvConfigOptions = {
  path: "./.env",
};

export { corsConfig,dotenvConfig };
