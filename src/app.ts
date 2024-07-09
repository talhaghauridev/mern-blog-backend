import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import useragent from "express-useragent";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config";
import { errorMiddleware } from "./middlewares/error.middleware";
dotenv.config();

const app = express();
app.use(helmet(config.helmet));
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression(config.compression));
app.use(useragent.express());
app.use(morgan("common"));

app.get("/", async (req: any, res) => {
  res.status(200).json({
    message: "Server is running perfectly",
  });
});

app.use(errorMiddleware);

export default app;
