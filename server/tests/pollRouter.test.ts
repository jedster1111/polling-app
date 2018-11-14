import request from "supertest";
import app from "../app";
import db from "../models/database";
import { getResponsePoll, getResponsePolls } from "../routes/pollRouter";
import {
  Poll,
  PollInput,
  PollResponse,
  PollResponseOption,
  UpdatePollInput,
  User,
  VoteInputRequest
} from "../types";
import createJwtCookie from "./createJwtCookie";

const voteLimit = 3;
const optionVoteLimit = 3;

const generateInputPolls = (n: number) => {
  const polls: PollInput[] = [];
  for (let i = 0; i < n; i++) {
    const index = i + 1;
    polls.push({
      pollName: `pollName${index}`,
      description: `description${index}`,
      creatorId: `${index}`,
      options: ["option1", "option2"],
      voteLimit,
      isOpen: true,
      optionVoteLimit,
      namespace: "jeds-room"
    });
  }
  return polls;
};

const generateInputUsers = (n: number) => {
  const users: User[] = [];
  for (let i = 0; i < n; i++) {
    const index = i + 1;
    users.push({
      id: `${index}`,
      displayName: `displayName${index}`,
      userName: `userName${index}`,
      photos: [{ value: "photoUrl" }]
    });
  }
  return users;
};

const getAnotherUser = (poll: Poll) => {
  return db.getAllUsers().find(user => user.id !== poll.creatorId)!;
};

describe("Testing poll related routes:", () => {
  beforeEach(() => {
    const noOfPolls = 5;
    db.resetPolls();
    db.resetUsers();
    const inputPolls = generateInputPolls(noOfPolls);
    const inputUsers = generateInputUsers(noOfPolls);
    inputPolls.forEach(pollInput => db.insertPoll(pollInput));
    inputUsers.forEach(userInput => db.insertUser(userInput));
  });

  afterEach(() => {
    db.resetPolls();
    db.resetUsers();
  });

  describe("Testing /api/polls:", () => {
    test("Can I get a list of all polls?", async () => {
      const storedPolls = db.getPolls();
      const responsePolls = getResponsePolls(storedPolls);

      const response = await request(app).get("/api/polls");

      const polls: PollResponse[] = response.body.polls;

      expect(polls).toEqual(responsePolls);
    });
    test("Can I create a poll and will I get it back in the response?", async () => {
      const userToUse = db.getAllUsers()[0];

      const inputData: PollInput = {
        creatorId: userToUse.id,
        description: "descriptionPOST",
        options: ["option1", "option2"],
        pollName: "pollNamePOST",
        voteLimit,
        isOpen: true,
        optionVoteLimit,
        namespace: "jeds-room"
      };

      const expectedResponse: PollResponse = {
        description: inputData.description,
        creator: userToUse,
        options: inputData.options.map<PollResponseOption>(
          (optionValue, index) => ({
            optionId: `${index + 1}`,
            value: optionValue,
            votes: []
          })
        ),
        pollName: inputData.pollName,
        isOpen: inputData.isOpen,
        namespace: inputData.namespace || "public",
        optionVoteLimit: inputData.optionVoteLimit,
        totalVotes: 0,
        voteLimit: inputData.voteLimit,
        pollId: "someID"
      };

      const token = createJwtCookie(userToUse.id);

      const payload = await request(app)
        .post("/api/polls")
        .send(inputData)
        .set("Accept", "application/json")
        .set("Cookie", token)
        .expect(201);

      const postResponse = JSON.parse(payload.text).poll;

      expect(postResponse).toMatchObject({
        ...expectedResponse,
        pollId: postResponse.pollId
      });
    });
  });

  describe("Testing /api/polls/:namespace/:id:", () => {
    test("Can I get a specific poll?", async () => {
      const pollToUse = db.getPolls()[0];
      const expectedPoll = getResponsePoll(pollToUse);

      const response = await request(app).get(
        `/api/polls/${pollToUse.namespace}/${pollToUse.pollId}`
      );
      const responsePoll: Poll = response.body.poll;

      expect(responsePoll).toMatchObject(expectedPoll);
    });

    test("Can I change the properties of a poll without losing votes?", async () => {
      const pollToUse = db.getPolls()[0];
      const creator = db.getUser(pollToUse.creatorId);

      const inputData: UpdatePollInput = {
        pollName: "pollNameChanged",
        options: [
          { optionId: "1", value: "changed1" },
          { optionId: "2", value: "changed2" }
        ]
      };

      const expectedResponse: PollResponse = {
        description: pollToUse.description,
        creator,
        options: [
          { optionId: "1", value: "changed1", votes: [] },
          {
            optionId: "2",
            value: "changed2",
            votes: [{ ...creator, numberOfVotes: 1 }]
          }
        ],
        pollId: pollToUse.pollId,
        pollName: "pollNameChanged",
        voteLimit,
        isOpen: true,
        totalVotes: 1,
        optionVoteLimit,
        namespace: pollToUse.namespace
      };

      const token = createJwtCookie(creator.id);

      await request(app)
        .post(`/api/polls/${pollToUse.namespace}/${pollToUse.pollId}/vote`)
        .send({ voterId: creator.id, optionId: "2" })
        .set("Accept", "application/json")
        .set("Cookie", token)
        .expect(200);

      const payload = await request(app)
        .post(`/api/polls/${pollToUse.namespace}/${pollToUse.pollId}`)
        .send(inputData)
        .set("Accept", "application/json")
        .set("Cookie", token)
        .expect(200);

      const postResponse = JSON.parse(payload.text).poll;

      expect(postResponse).toEqual(expectedResponse);
    });

    test("Can I remove a specific poll?", async () => {
      const pollToRemove = db.getPolls()[0];
      const { pollId, namespace } = pollToRemove;
      await request(app)
        .delete(`/api/polls/${namespace}/${pollId}`)
        .set("Cookie", createJwtCookie(pollToRemove.creatorId))
        .expect(200);

      expect(db.getPoll(`${pollId}`, namespace)).toBeNull();
    });

    test("Am I unable to remove a poll that I didn't create?", async () => {
      const pollToRemove = db.getPolls()[0];
      const userToUse = getAnotherUser(pollToRemove);

      await request(app)
        .delete(`/api/polls/${pollToRemove.namespace}/${pollToRemove.pollId}`)
        .set("Cookie", createJwtCookie(userToUse.id))
        .expect(401);
    });

    test("Am I unable to edit a poll that I didn't create?", async () => {
      const pollToEdit = db.getPolls()[0];
      const userToUse = getAnotherUser(pollToEdit);
      await request(app)
        .post(`/api/polls/${pollToEdit.pollId}`)
        .send({
          pollName: "pollNameChanged",
          options: [
            { optionId: "1", value: "changed1" },
            { optionId: "2", value: "changed2" }
          ]
        })
        .set("Cookie", createJwtCookie(userToUse.id))
        .expect(401);
    });
  });

  describe("Testing /api/polls/:id/vote:", () => {
    test("Can I vote on a poll?", async () => {
      const pollToVote = db.getPolls()[0];
      const userToUse = db.getUser(pollToVote.creatorId);
      const voteInput: VoteInputRequest = { optionId: "1" };

      const token = createJwtCookie(userToUse.id);

      // console.log(object);

      const response = await request(app)
        .post(`/api/polls/${pollToVote.pollId}/vote`)
        .send(voteInput)
        .set("Accept", "application/json")
        .set("Cookie", token)
        .expect(200);
      const postResponse: PollResponse = JSON.parse(response.text).poll;

      expect(postResponse.options[0].votes).toEqual([
        { ...userToUse, numberOfVotes: 1 }
      ]);
      expect(postResponse.options[0].votes.length).toBe(1);
      expect(postResponse.options[1].votes).toEqual([]);
    });
  });

  describe("Testing /api/poll/:id/remove-vote", () => {
    test("Can I remove a vote on a poll?", async () => {
      const pollToVote = db.getPolls()[0];
      const userToUse = db.getUser(pollToVote.creatorId);
      const voteInput: VoteInputRequest = { optionId: "1" };

      const token = createJwtCookie(userToUse.id);

      await request(app)
        .post(`/api/polls/${pollToVote.pollId}/vote`)
        .send(voteInput)
        .set("Accept", "application/json")
        .set("Cookie", token)
        .expect(200);

      const response = await request(app)
        .post(`/api/polls/${pollToVote.pollId}/remove-vote`)
        .send(voteInput)
        .set("Accept", "application/json")
        .set("Cookie", token)
        .expect(200);

      const postResponse: PollResponse = JSON.parse(response.text).poll;

      expect(postResponse.options[0].votes).toEqual([
        { ...userToUse, numberOfVotes: 0 }
      ]);
    });
  });

  describe("Testing /api/polls/:id/open and /api/polls/:id/close", () => {
    test("Can I close a poll and then re-open it?", async () => {
      const pollToChange = db.getPolls()[0];
      const userToUse = db.getUser(pollToChange.creatorId);

      pollToChange.isOpen = false;

      const token = createJwtCookie(userToUse.id);

      let response = await request(app)
        .post(`/api/polls/${pollToChange.pollId}/close`)
        .set("Accept", "application/json")
        .set("Cookie", token)
        .expect(200);
      let postResponse: PollResponse = JSON.parse(response.text).poll;

      expect(postResponse.isOpen).toBe(pollToChange.isOpen);

      pollToChange.isOpen = true;

      response = await request(app)
        .post(`/api/polls/${pollToChange.pollId}/open`)
        .set("Accept", "application/json")
        .set("Cookie", token)
        .expect(200);
      postResponse = JSON.parse(response.text).poll;

      expect(postResponse.isOpen).toBe(pollToChange.isOpen);
    });
    test("It should stop me from opening/closing a poll I didn't create", async () => {
      const pollToChange = db.getPolls()[0];
      const userToUse = getAnotherUser(pollToChange);

      const token = createJwtCookie(userToUse.id);

      await request(app)
        .post(`/api/polls/${pollToChange.pollId}/close`)
        .set("Accept", "application/json")
        .set("Cookie", token)
        .expect(401);

      await request(app)
        .post(`/api/polls/${pollToChange.pollId}/open`)
        .set("Accept", "application/json")
        .set("Cookie", token)
        .expect(401);
    });
  });
});
