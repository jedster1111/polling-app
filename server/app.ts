import bodyParser = require("body-parser");
import express = require("express");
import { ErrorRequestHandler } from "express";
import path = require("path");
import pollRouter from "./routes/pollRouter";

export interface ErrorWithStatusCode extends Error {
  statusCode?: number;
}

const app = express();
const errorHandlerMiddleware: ErrorRequestHandler = (
  err: ErrorWithStatusCode,
  req,
  res,
  next
) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  console.log("Something went wrong!");
  console.error(err);
  res.status(err.statusCode).json({ error: err.message });
  console.log("Carrying on then...");
};

app.use(express.static(path.resolve(__dirname, "dist")));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "dist", "index.html"));
});
app.use("/api/polls", pollRouter);
app.use(errorHandlerMiddleware);

export default app;
