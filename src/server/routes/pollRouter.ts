import express = require("express");
import pollsModel from "../models/pollsModel";

const pollRouter = express.Router();

pollRouter
  .route("/")
  .get((req, res) => {
    const polls: object[] = pollsModel.find();
    console.log("/api/polls was accessed");
    res.json(polls);
  })
  .post(async (req, res) => {
    console.log("POST was called", req.body);
    const newPoll = req.body;
    await pollsModel.insert(newPoll);
    console.log(pollsModel.find());
    res.status(200).send(newPoll);
  });

export default pollRouter;
