import bodyParser from "body-parser";
import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { corsConfig, dotenvConfig } from "./config";

dotenv.config(dotenvConfig);
const app: Application = express();

app.use(cors(corsConfig));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

export default app;
