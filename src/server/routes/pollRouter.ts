import express = require("express");
import pollsModel from "../models/pollsModel";

const pollRouter = express.Router();

pollRouter
  .route("/")
  .get((req, res) => {
    const polls: object[] = pollsModel.find();
    res.json(polls);
  })
  .post((req, res) => {
    const newPoll = req.body;
    pollsModel.insert(newPoll);
    res.status(200).send(pollsModel.find({ id: req.body.id }));
  });

export default pollRouter;
