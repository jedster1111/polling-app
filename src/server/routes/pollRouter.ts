import express = require("express");
import db from "../models/database";

const pollRouter = express.Router();

pollRouter
  .route("/")
  .get((req, res) => {
    const polls = db.getPolls();
    res.json(polls);
  })
  .post((req, res) => {
    const newPoll = req.body;
    db.insertPoll(newPoll);
    const pollId: string = req.body.id;
    res.status(200).send(db.getPoll({ pollId }));
  });
pollRouter.route("/:id").get((req, res) => {
  const poll = db.getPoll({ pollId: req.params.id });
  res.json(poll);
});

export default pollRouter;
