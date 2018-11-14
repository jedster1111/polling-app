import express from "express";
import passport from "passport";
import db from "../models/database";
import {
  CreatePollRequest,
  PollResponseUser,
  StoredPollOption,
  VoteInputRequest
} from "../types";
import {
  Poll,
  PollResponse,
  PollResponseOption,
  UpdatePollInput
} from "../types";

const pollRouter = express.Router();
export const getResponsePolls = (storedPolls: Poll[]): PollResponse[] => {
  return storedPolls.map<PollResponse>(storedPoll => {
    return getResponsePoll(storedPoll);
  });
};
export const getResponsePoll = (storedPoll: Poll): PollResponse => {
  const {
    creatorId,
    options,
    description,
    pollName,
    pollId,
    voteLimit,
    isOpen,
    optionVoteLimit,
    namespace
  } = storedPoll;
  const creator = db.getUser(creatorId);
  return {
    description,
    pollId,
    pollName,
    voteLimit,
    creator: {
      displayName: creator.displayName,
      id: creator.id,
      userName: creator.userName,
      photos: creator.photos
    },
    options: options.map<PollResponseOption>(option => {
      return {
        optionId: option.optionId,
        value: option.value,
        votes: Object.keys(option.votes).map<PollResponseUser>(userId => {
          const user = db.getUser(userId);
          return {
            ...user,
            numberOfVotes: option.votes[userId] || 0
          };
        })
      };
    }),
    isOpen,
    totalVotes: calculateTotalVotes(options),
    optionVoteLimit,
    namespace
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
          db.insertPoll({ ...newPoll, creatorId: user.id, isOpen: true })
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
    const poll = getResponsePoll(db.getPoll(req.params.pollId));
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
    db.removePoll(userId, pollId);
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

pollRouter
  .route("/:pollId/remove-vote")
  .post(
    passport.authenticate(["jwt"], { session: false }),
    (req, res, next) => {
      try {
        const userId: string = req.user.id;
        const pollId: string = req.params.pollId;
        const voteInput: VoteInputRequest = req.body;
        const poll = getResponsePoll(
          db.removeVotePoll(pollId, {
            optionId: voteInput.optionId,
            voterId: userId
          })
        );
        res.status(200).json({ poll });
      } catch (error) {
        next(error);
      }
    }
  );

pollRouter
  .route("/:pollId/open")
  .post(
    passport.authenticate(["jwt"], { session: false }),
    (req, res, next) => {
      try {
        const userId: string = req.user.id;
        const pollId: string = req.params.pollId;

        const poll = getResponsePoll(db.openPoll(userId, pollId));

        res.status(200).json({ poll });
      } catch (error) {
        next(error);
      }
    }
  );
pollRouter
  .route("/:pollId/close")
  .post(
    passport.authenticate(["jwt"], { session: false }),
    (req, res, next) => {
      try {
        const userId: string = req.user.id;
        const pollId: string = req.params.pollId;

        const poll = getResponsePoll(db.closePoll(userId, pollId));

        res.status(200).json({ poll });
      } catch (error) {
        next(error);
      }
    }
  );

export function calculateTotalVotes(options: StoredPollOption[]): number {
  return options.reduce((accum, option) => {
    Object.values(option.votes).forEach(voteNumber => (accum += voteNumber));
    return accum;
  }, 0);
}

export default pollRouter;
