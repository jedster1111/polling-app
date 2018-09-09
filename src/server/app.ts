import bodyParser = require("body-parser");
import express = require("express");
import { ErrorRequestHandler } from "express";
import pollRouter from "./routes/pollRouter";

const app = express();

const errorHandlerMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  console.error("whoops");
  res.status(500).send("Something broke");
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/polls", pollRouter);
app.use(errorHandlerMiddleware);

export default app;
