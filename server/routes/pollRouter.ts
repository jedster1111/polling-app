import express = require("express");
import db, { UpdatePollInput } from "../models/database";

const pollRouter = express.Router();

pollRouter
  .route("/")
  .get((req, res) => {
    const polls = db.getPolls();
    res.json({ polls });
  })
  .post((req, res, next) => {
    try {
      const newPoll = req.body;
      const poll = db.insertPoll(newPoll);
      res.status(201);
      res.json({ poll });
    } catch (error) {
      next(error);
    }
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
  })
  .delete((req, res) => {
    const pollId = req.params.pollId;
    db.removePollById(pollId);
    res.status(200).send();
  });

pollRouter.route("/:pollId/vote").post((req, res, next) => {
  try {
    const pollId: string = req.params.pollId;
    const voteInput = req.body;
    const poll = db.votePoll(pollId, voteInput);
    res.status(200).json({ poll });
  } catch (error) {
    next(error);
  }
});

export default pollRouter;
