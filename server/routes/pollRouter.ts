import express = require("express");
import { passport } from "../app";
import db from "../models/database";
import {
  PollResponse,
  PollResponseOption,
  PollResponseUser,
  StoredPoll,
  UpdatePollInput,
  VoteInput
} from "../types";

const pollRouter = express.Router();
const getResponsePolls = (storedPolls: StoredPoll[]): PollResponse[] => {
  return storedPolls.map<PollResponse>(storedPoll => {
    return getResponsePoll(storedPoll);
  });
};
const getResponsePoll = (storedPoll: StoredPoll): PollResponse => {
  const { creatorId, options, description, pollName, pollId } = storedPoll;
  const creator = db.getUser(creatorId);
  return {
    description,
    pollId,
    pollName,
    creator: { displayName: creator.displayName, id: creator.id },
    options: options.map<PollResponseOption>(option => ({
      optionId: option.optionId,
      value: option.value,
      votes: option.votes.map<PollResponseUser>(userId => {
        const user = db.getUser(userId);
        return { id: userId, displayName: user.displayName };
      })
    }))
  };
};

pollRouter
  .route("/")
  .get((req, res) => {
    const storedPolls = db.getPolls();
    const polls = getResponsePolls(storedPolls);
    res.json({ polls });
  })
  .post(
    passport.authenticate(["jwt"], { session: false }),
    (req, res, next) => {
      try {
        const newPoll = req.body;
        const poll = getResponsePoll(db.insertPoll(newPoll));
        res.status(201);
        res.json({ poll });
      } catch (error) {
        next(error);
      }
    }
  );

pollRouter
  .route("/:pollId")
  .get((req, res) => {
    const poll = getResponsePoll(db.getPoll({ pollId: req.params.pollId }));
    res.json({ poll });
  })
  .post(
    passport.authenticate(["jwt"], { session: false }),
    (req, res, next) => {
      try {
        const updatedPollInput: UpdatePollInput = req.body;
        const pollId = req.params.pollId;
        const poll = getResponsePoll(db.updatePoll(pollId, updatedPollInput));
        res.status(200).json({ poll });
      } catch (error) {
        next(error);
      }
    }
  )
  .delete(passport.authenticate(["jwt"], { session: false }), (req, res) => {
    const pollId = req.params.pollId;
    db.removePollById(pollId);
    res.status(200).send();
  });

pollRouter
  .route("/:pollId/vote")
  .post(
    passport.authenticate(["jwt"], { session: false }),
    (req, res, next) => {
      try {
        const pollId: string = req.params.pollId;
        const voteInput: VoteInput = req.body;
        const poll = getResponsePoll(db.votePoll(pollId, voteInput));
        res.status(200).json({ poll });
      } catch (error) {
        next(error);
      }
    }
  );

export default pollRouter;
