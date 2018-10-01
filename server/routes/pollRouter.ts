import express = require("express");
import { passport } from "../app";
import db from "../models/database";
import { CreatePollRequest, VoteInputRequest } from "../types";
import {
  PollResponse,
  PollResponseOption,
  PollResponseUser,
  StoredPoll,
  UpdatePollInput
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
        const user = req.user;
        const newPoll: CreatePollRequest = req.body;
        const poll = getResponsePoll(
          db.insertPoll({ ...newPoll, creatorId: user.id })
        );
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
        const userId = req.user.id;
        const updatedPollInput: UpdatePollInput = req.body;
        const pollId = req.params.pollId;
        const poll = getResponsePoll(
          db.updatePoll(userId, pollId, updatedPollInput)
        );
        res.status(200).json({ poll });
      } catch (error) {
        next(error);
      }
    }
  )
  .delete(passport.authenticate(["jwt"], { session: false }), (req, res) => {
    const userId: string = req.user.id;
    const pollId = req.params.pollId;
    db.removePollById(userId, pollId);
    res.status(200).send();
  });

pollRouter
  .route("/:pollId/vote")
  .post(
    passport.authenticate(["jwt"], { session: false }),
    (req, res, next) => {
      try {
        const userId: string = req.user.id;
        const pollId: string = req.params.pollId;
        const voteInput: VoteInputRequest = req.body;
        const poll = getResponsePoll(
          db.votePoll(pollId, { optionId: voteInput.optionId, voterId: userId })
        );
        res.status(200).json({ poll });
      } catch (error) {
        next(error);
      }
    }
  );

export default pollRouter;
