import express = require("express");
import db, { UpdatePollInput } from "../models/database";

const pollRouter = express.Router();

pollRouter
  .route("/")
  .get((req, res) => {
    const polls = db.getPolls();
    res.json({ polls });
  })
  .post((req, res) => {
    const newPoll = req.body;
    const poll = db.insertPoll(newPoll);
    res.status(201);
    res.json({ poll });
  });

pollRouter
  .route("/:pollId")
  .get((req, res) => {
    const poll = db.getPoll({ pollId: req.params.pollId });
    res.json({ poll });
  })
  .post((req, res) => {
    const updatedPollInput: UpdatePollInput = req.body;
    const pollId = req.params.pollId;
    const poll = db.updatePoll(pollId, updatedPollInput);
    res.status(200).json({ poll });
  });

export default pollRouter;
