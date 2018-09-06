import bodyParser = require("body-parser");
import express = require("express");
import pollRouter from "./routes/pollRouter";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/polls", pollRouter);

export default app;
