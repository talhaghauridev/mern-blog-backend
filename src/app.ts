import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import useragent from "express-useragent";
import helmet from "helmet";
import morgan from "morgan";
// @ts-ignore
import cookieParser from "cookie-parser";
import passport from "passport";
import { config } from "./config";
import { errorMiddleware } from "./middlewares/error.middleware";
import AuthRoutes from "./routes/auth.routes";
import "./utils/passport";

const app = express();
app.use(helmet());
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(useragent.express());
app.use(compression(config.compression));
app.use(session(config.session));
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan("dev"));

app.use("/auth", AuthRoutes);

app.get("/", (req: any, res) => {
  res.status(200).json({
    message: "Server is running perfectly",
    success: true,
  });
});

app.use(errorMiddleware);

export default app;
