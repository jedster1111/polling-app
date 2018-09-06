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
  .post((req, res) => {
    console.log(req.body);
    const newPoll = req.body;
    pollsModel.insert(newPoll);
    res.status(200).send(pollsModel.find({ name: req.body.name }));
  });

export default pollRouter;
