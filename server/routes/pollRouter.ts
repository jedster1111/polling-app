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
        const newPoll: CreatePollRequest = req.body.poll;
        const poll = getResponsePoll(
          db.insertPoll({
            ...newPoll,
            creatorId: user.id,
            isOpen: true
          })
        );
        res.status(201);
        res.json({ poll });
      } catch (error) {
        next(error);
      }
    }
  );

pollRouter
  .route("/:namespace")
  .get((req, res) => {
    const polls = getResponsePolls(
      db.getPollsByNamespace(req.params.namespace)
    );
    res.json({ polls });
  })
  .post(
    passport.authenticate(["jwt"], { session: false }),
    (req, res, next) => {
      try {
        const user = req.user;
        const newPoll: CreatePollRequest = req.body.poll;
        const urlNamespace = req.params.namespace;

        const poll = getResponsePoll(
          db.insertPoll({
            ...newPoll,
            creatorId: user.id,
            isOpen: true,
            namespace: newPoll.namespace || urlNamespace
          })
        );
        res.status(201).json({ poll });
      } catch (error) {
        next(error);
      }
    }
  );

pollRouter
  .route("/:namespace/:pollId")
  .get((req, res) => {
    const poll = getResponsePoll(
      db.getPoll(req.params.pollId, req.params.namespace)
    );
    res.json({ poll });
  })
  .post(
    passport.authenticate(["jwt"], { session: false }),
    (req, res, next) => {
      try {
        const userId = req.user.id;
        const updatedPollInput: UpdatePollInput = req.body;
        const { pollId, namespace } = req.params;
        const poll = getResponsePoll(
          db.updatePoll(userId, pollId, updatedPollInput, namespace)
        );
        res.status(200).json({ poll });
      } catch (error) {
        next(error);
      }
    }
  )
  .delete(passport.authenticate(["jwt"], { session: false }), (req, res) => {
    const userId: string = req.user.id;
    const { pollId, namespace } = req.params;
    db.removePoll(userId, pollId, namespace);
    res.status(200).send();
  });

pollRouter
  .route("/:namespace/:pollId/vote")
  .post(
    passport.authenticate(["jwt"], { session: false }),
    (req, res, next) => {
      try {
        const userId: string = req.user.id;
        const { pollId, namespace } = req.params;
        const voteInput: VoteInputRequest = req.body;
        const poll = getResponsePoll(
          db.votePoll(
            pollId,
            { optionId: voteInput.optionId, voterId: userId },
            namespace
          )
        );
        res.status(200).json({ poll });
      } catch (error) {
        next(error);
      }
    }
  );

pollRouter
  .route("/:namespace/:pollId/remove-vote")
  .post(
    passport.authenticate(["jwt"], { session: false }),
    (req, res, next) => {
      try {
        const userId: string = req.user.id;
        const { pollId, namespace } = req.params;
        const voteInput: VoteInputRequest = req.body;
        const poll = getResponsePoll(
          db.removeVotePoll(
            pollId,
            {
              optionId: voteInput.optionId,
              voterId: userId
            },
            namespace
          )
        );
        res.status(200).json({ poll });
      } catch (error) {
        next(error);
      }
    }
  );

pollRouter
  .route("/:namespace/:pollId/open")
  .post(
    passport.authenticate(["jwt"], { session: false }),
    (req, res, next) => {
      try {
        const userId: string = req.user.id;
        const { pollId, namespace } = req.params;

        const poll = getResponsePoll(db.openPoll(userId, pollId, namespace));

        res.status(200).json({ poll });
      } catch (error) {
        next(error);
      }
    }
  );
pollRouter
  .route("/:namespace/:pollId/close")
  .post(
    passport.authenticate(["jwt"], { session: false }),
    (req, res, next) => {
      try {
        const userId: string = req.user.id;
        const { pollId, namespace } = req.params;

        const poll = getResponsePoll(db.closePoll(userId, pollId, namespace));

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
