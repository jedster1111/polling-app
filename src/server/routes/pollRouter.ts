import express = require("express");
import db from "../models/database";

const pollRouter = express.Router();

pollRouter
  .route("/")
  .get((req, res) => {
    const polls: object[] = db.getPolls();
    res.json(polls);
  })
  .post((req, res) => {
    const newPoll = req.body;
    db.insertPoll(newPoll);
    res.status(200).send(db.getPoll({ pollId: req.body.id }));
  });

export default pollRouter;
