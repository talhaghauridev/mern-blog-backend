import bodyParser from "body-parser";
import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { corsConfig, dotenvConfig } from "./config";
import compression from "compression";
dotenv.config(dotenvConfig);

const app: Application = express();

app.use(
  compression({
    level: 6,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  })
);

app.use(cors(corsConfig));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

export default app;
