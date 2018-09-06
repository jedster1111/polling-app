import bodyParser = require("body-parser");
import express = require("express");
import loki = require("lokijs");
import request = require("supertest");
import pollRouter from "./routes/pollRouter";

const app = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/polls", pollRouter);

app.listen(port, () => console.log(`App is running on port: ${port}`));
