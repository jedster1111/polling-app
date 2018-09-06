import express = require("express");
import pollsModel from "../models/pollsModel";

const pollRouter = express.Router();

pollRouter.route("/").get((req, res) => {
  const polls: object[] = pollsModel.find();
  console.log("/api/polls was accessed");
  res.json(polls);
});
export default pollRouter;
