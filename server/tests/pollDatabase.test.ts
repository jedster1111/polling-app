import uuid from "uuid/v1";
import db from "../models/database";
import { Poll, PollInput, StoredPollOption } from "../types";

const numberOfPolls = 3;

const generatePollInputs = (n: number) => {
  const polls: PollInput[] = [];
  for (let i = 0; i < n; i++) {
    const index = i + 1;
    polls.push({
      creatorId: `${index}`,
      pollName: `pollName${index}`,
      description: `description${index}`,
      options: ["option1", "option2"],
      voteLimit: 3,
      isOpen: true,
      optionVoteLimit: 3,
      namespace: "jeds-room"
    });
  }
  return polls;
};
function generateExpectedPolls(n: number) {
  const expectedPolls: Array<{
    creatorId: string;
    pollName: string;
    description: string;
    options: Array<{
      optionId: string;
      value: string;
      votes: { [userId: string]: number };
    }>;
    voteLimit: number;
    optionVoteLimit: number;
    isOpen: boolean;
    namespace: string;
  }> = [];

  for (let i = 0; i < n; i++) {
    const index = i + 1;
    expectedPolls.push({
      creatorId: `${index}`,
      pollName: `pollName${index}`,
      description: `description${index}`,
      options: [
        { optionId: "1", value: "option1", votes: {} },
        { optionId: "2", value: "option2", votes: {} }
      ],
      voteLimit: 3,
      optionVoteLimit: 3,
      isOpen: true,
      namespace: "jeds-room"
    });
  }
  return expectedPolls;
}
function generateExpectedOptions(updateInput: {
  pollName: string;
  description: string;
  options: Array<{ optionId: string; value: string }>;
}): StoredPollOption[] {
  const expectedPollOptions = generateExpectedPolls(1)[0].options;
  updateInput.options.forEach(option => {
    const optionToChange = expectedPollOptions.find(
      expectedOption => expectedOption.optionId === option.optionId
    );
    if (optionToChange) {
      optionToChange.value = option.value;
    }
  });
  return expectedPollOptions;
}

describe("Testing poll related database methods:", () => {
  beforeEach(() => {
    const pollInputs = generatePollInputs(3);
    db.resetPolls();
    pollInputs.forEach(pollInput => db.insertPoll(pollInput));
  });
  afterEach(() => {
    db.resetPolls();
  });

  describe("Testing getPolls:", () => {
    test("Can I get all the polls?", () => {
      const expectedPolls = generateExpectedPolls(numberOfPolls);
      const polls = db.getPolls();

      expect(polls).toMatchObject(expectedPolls);
    });
  });

  describe("Testing insertPoll and getPoll:", () => {
    const expectedPoll = generateExpectedPolls(1)[0];
    test("Can I add a poll?", () => {
      const insertPollData = generatePollInputs(1)[0];
      const poll = db.insertPoll(insertPollData);

      expect(poll).toMatchObject(expectedPoll);
    });

    test("If I create a poll with options containing empty strings, do the empty strings get filtered?", () => {
      const pollInput = generatePollInputs(1)[0];
      pollInput.options.push("", "");
      const poll = db.insertPoll(pollInput);
      const result = generateExpectedPolls(1)[0];
      expect(poll).toMatchObject(result);
      expect(poll.options.length).toBe(result.options.length);
    });

    test("If I create a poll with optionVoteLimit greater than voteLimit an error sould be thrown", () => {
      const pollInput = generatePollInputs(1)[0];
      pollInput.optionVoteLimit = pollInput.voteLimit + 1;

      expect(() => db.insertPoll(pollInput)).toThrowError();
    });

    test("creating a poll with voteLimit <= 0 should throw an error", () => {
      const pollInput = generatePollInputs(1)[0];
      pollInput.voteLimit = 0;

      expect(() => db.insertPoll(pollInput)).toThrowError();

      pollInput.voteLimit = -1;
      expect(() => db.insertPoll(pollInput)).toThrowError();
    });

    test("creating a poll with optionVoteLimit <= 0 should throw an error", () => {
      const pollInput = generatePollInputs(1)[0];
      pollInput.optionVoteLimit = 0;

      expect(() => db.insertPoll(pollInput)).toThrowError();

      pollInput.optionVoteLimit = -1;
      expect(() => db.insertPoll(pollInput)).toThrowError();
    });

    test("namespace should have capitals, punctuation and white spaces removed", () => {
      const pollInput = generatePollInputs(1)[0];
      pollInput.namespace = "  jed's room";

      const poll = db.insertPoll(pollInput);
      expect(poll).toMatchObject({ ...expectedPoll, namespace: "jeds-room" });
    });

    test("creating a poll with a falsey namespace should return public as the namespace", () => {
      const pollInput = generatePollInputs(1)[0];
      pollInput.namespace = "";

      const poll = db.insertPoll(pollInput);
      expect(poll).toMatchObject({ ...expectedPoll, namespace: "public" });
    });

    test("Can I get a poll by Id?", () => {
      const storedPolls = db.getPolls();
      const poll = db.getPoll(storedPolls[0].pollId, storedPolls[0].namespace);
      expect(poll).toEqual(storedPolls[0]);
    });

    test("can I get polls by namespace", () => {
      const storedPolls = db.getPolls();
      const namespace = storedPolls[0].namespace;

      const expectedPolls = storedPolls.filter(
        poll => poll.namespace === namespace
      );
      const polls = db.getPollsByNamespace(namespace);

      expect(polls).toEqual(expectedPolls);
    });
  });

  describe("Testing updatePoll:", () => {
    test("Can I update a poll's name, option value and description?", () => {
      // get a poll stored in the db
      const pollToUpdate = db.getPolls()[0];
      // the data that will be used to update the poll
      const updateInput = {
        pollName: "changedName",
        description: "changedDescription",
        options: [
          { optionId: pollToUpdate.options[0].optionId, value: "changed" },
          { optionId: pollToUpdate.options[1].optionId, value: "changed2" }
        ],
        voteLimit: 3
      };

      const expectedPollOptions = generateExpectedOptions(updateInput);

      const expectedPoll: Poll = {
        creatorId: pollToUpdate.creatorId,
        pollId: pollToUpdate.pollId,
        pollName: updateInput.pollName,
        description: updateInput.description,
        options: expectedPollOptions,
        voteLimit: updateInput.voteLimit,
        isOpen: true,
        optionVoteLimit: pollToUpdate.optionVoteLimit,
        namespace: pollToUpdate.namespace
      };

      const poll = db.updatePoll(
        pollToUpdate.creatorId,
        pollToUpdate.pollId,
        updateInput,
        pollToUpdate.namespace
      );
      expect(poll).toMatchObject(expectedPoll);
    });

    test("If I try and update a non existent poll, is an error thrown?", () => {
      const PollId = uuid();
      expect(() => {
        db.updatePoll("1", PollId, { description: "changed" }, "public");
      }).toThrow(`Poll with Id ${PollId} could not be found`);
    });

    test("If I try and update a poll using empty strings, are the changes ignored?", () => {
      const inputPoll = db.getPolls()[0];
      const updatePoll = db.updatePoll(
        inputPoll.creatorId,
        inputPoll.pollId,
        {
          pollName: "",
          description: ""
        },
        inputPoll.namespace
      );
      expect(updatePoll).toMatchObject(inputPoll);
    });

    test("Should delete an option when I input an empty string", () => {
      const inputPoll = db.getPolls()[0];

      const updatePoll = db.updatePoll(
        inputPoll.creatorId,
        inputPoll.pollId,
        {
          options: [{ optionId: inputPoll.options[0].optionId, value: "" }]
        },
        inputPoll.namespace
      );

      inputPoll.options.shift();

      expect(updatePoll).toMatchObject(inputPoll);
    });

    test("Updating a poll to have an optionVoteLimit greater than the voteLimit should throw an error", () => {
      const { creatorId, pollId, voteLimit, namespace } = db.getPolls()[0];

      expect(() =>
        db.updatePoll(
          creatorId,
          pollId,
          { optionVoteLimit: voteLimit + 1 },
          namespace
        )
      ).toThrowError();
    });

    test("Setting voteLimit less than or equal to zero should throw an error", () => {
      const { creatorId, pollId, namespace } = db.getPolls()[0];

      expect(() =>
        db.updatePoll(creatorId, pollId, { voteLimit: 0 }, namespace)
      ).toThrowError();

      expect(() =>
        db.updatePoll(creatorId, pollId, { voteLimit: -2 }, namespace)
      ).toThrowError();
    });

    test("Setting optionVoteLimit less than or equal to zero should throw an error", () => {
      const { creatorId, pollId, namespace } = db.getPolls()[0];

      expect(() =>
        db.updatePoll(creatorId, pollId, { optionVoteLimit: 0 }, namespace)
      ).toThrowError();

      expect(() =>
        db.updatePoll(creatorId, pollId, { optionVoteLimit: -2 }, namespace)
      ).toThrowError();
    });
  });

  describe("Testing votePoll:", () => {
    const userId = "1";

    test("Can I vote on a poll?", () => {
      const expectedPoll = generateExpectedPolls(1)[0];
      expectedPoll.options[0].votes[userId] = 1;
      const poll = db.votePoll(
        userId,
        {
          optionId: expectedPoll.options[0].optionId,
          voterId: expectedPoll.creatorId
        },
        expectedPoll.namespace
      );
      expect(poll).toMatchObject(expectedPoll);
    });
    test("Can I vote on a poll and then remove the vote", () => {
      const pollToVote = db.getPolls()[0];

      const expectedPoll = generateExpectedPolls(1)[0];

      db.votePoll(
        pollToVote.pollId,
        {
          optionId: expectedPoll.options[0].optionId,
          voterId: userId
        },
        expectedPoll.namespace
      );

      const poll = db.removeVotePoll(
        pollToVote.pollId,
        {
          optionId: expectedPoll.options[0].optionId,
          voterId: userId
        },
        expectedPoll.namespace
      );

      expect(poll).toMatchObject(expectedPoll);
    });
    it("should restrict my vote if the voteLimit has been reached", () => {
      const { optionVoteLimit, pollId, options, namespace } = db.getPolls()[0];

      const expectedPoll = generateExpectedPolls(1)[0];
      expectedPoll.options[0].votes[userId] = optionVoteLimit;
      const voteInput = {
        optionId: options[0].optionId,
        voterId: userId
      };

      const poll = voteOnPollNTimes(
        optionVoteLimit,
        pollId,
        voteInput,
        namespace
      );

      expect(poll).toMatchObject(expectedPoll);

      const voteInput2 = {
        optionId: expectedPoll.options[1].optionId,
        voterId: userId
      };

      expect(() =>
        db.votePoll(expectedPoll.options[0].optionId, voteInput2, namespace)
      ).toThrow();
    });

    test("Adding or removing a vote on a poll that's closed should throw an error", () => {
      let pollToVote = db.getPolls()[0];

      db.votePoll(
        pollToVote.pollId,
        {
          optionId: pollToVote.options[0].optionId,
          voterId: userId
        },
        pollToVote.namespace
      );

      pollToVote = db.closePoll(
        pollToVote.creatorId,
        pollToVote.pollId,
        pollToVote.namespace
      );

      expect(() =>
        db.votePoll(
          pollToVote.pollId,
          {
            voterId: userId,
            optionId: pollToVote.options[0].optionId
          },
          pollToVote.namespace
        )
      ).toThrowError();
      expect(pollToVote).toEqual(
        db.getPoll(pollToVote.pollId, pollToVote.namespace)
      );

      expect(() =>
        db.removeVotePoll(
          pollToVote.pollId,
          {
            voterId: userId,
            optionId: pollToVote.options[0].optionId
          },
          pollToVote.namespace
        )
      ).toThrowError();
      expect(pollToVote).toEqual(
        db.getPoll(pollToVote.pollId, pollToVote.namespace)
      );
    });

    test("Adding a vote on an option that has reached the optionVoteLimit should throw an error", () => {
      const pollToVote = db.getPolls()[0];

      const pollId = pollToVote.pollId;
      const voteInput = {
        optionId: pollToVote.options[0].optionId,
        voterId: userId
      };

      voteOnPollNTimes(
        pollToVote.optionVoteLimit,
        pollId,
        voteInput,
        pollToVote.namespace
      );

      expect(() =>
        db.votePoll(pollId, voteInput, pollToVote.namespace)
      ).toThrowError();
    });
  });

  describe("Testing open and close Poll", () => {
    test("Can I close a poll? And then re-open it?", () => {
      // const expectedPoll = generateExpectedPolls(1)[0];
      const expectedPoll = db.getPolls()[0];
      expectedPoll.isOpen = false;

      let poll = db.closePoll(
        expectedPoll.creatorId,
        expectedPoll.pollId,
        expectedPoll.namespace
      );

      expect(poll).toEqual(expectedPoll);

      expectedPoll.isOpen = true;

      poll = db.openPoll(
        expectedPoll.creatorId,
        expectedPoll.pollId,
        expectedPoll.namespace
      );

      expect(poll).toEqual(expectedPoll);
    });
    test("Does trying to open/close a poll with wrong userId throw an error?", () => {
      const pollToChange = db.getPolls()[0];

      expect(() =>
        db.closePoll("wrongId", pollToChange.pollId, pollToChange.namespace)
      ).toThrowError();
      expect(() =>
        db.openPoll("wrongId", pollToChange.pollId, pollToChange.namespace)
      ).toThrowError();
    });
  });

  describe("Testing removePoll:", () => {
    test("Can I remove a poll?", () => {
      db.removePoll("1", "1", "public");
      const polls = db.getPolls();
      const expectedPolls = generateExpectedPolls(numberOfPolls);
      expectedPolls.shift();
      expect(polls).toMatchObject(expectedPolls);
    });
  });
});

function voteOnPollNTimes(
  numberOfVotes: number = 1,
  pollId: string,
  voteInput: { optionId: string; voterId: string },
  namespace: string
) {
  for (let i = 0; i < numberOfVotes - 1; i++) {
    db.votePoll(pollId, voteInput, namespace);
  }
  // return the last vote
  return db.votePoll(pollId, voteInput, namespace);
}
