import express = require("express");
import pollsModel from "../models/pollsModel";

const pollRouter = express.Router();

pollRouter.route("/").get((req, res) => {
  const poll = pollsModel.findOne({ name: "test2" });
  console.log(poll);
});
export default pollRouter;
