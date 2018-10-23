import request from "supertest";
import app from "../app";
import db from "../models/database";
import { getResponsePoll, getResponsePolls } from "../routes/pollRouter";
import {
  Poll,
  PollInput,
  PollResponse,
  UpdatePollInput,
  User,
  VoteInputRequest
} from "../types";
import createJwtCookie from "./createJwtCookie";

const voteLimit = 3;

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
      isOpen: true
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

const getAnotherUser = (pollToRemove: Poll) => {
  return db.getAllUsers().find(user => user.id !== pollToRemove.creatorId)!;
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
        isOpen: true
      };

      const expectedResponse = {
        description: "descriptionPOST",
        creator: userToUse,
        options: [
          { optionId: "1", value: "option1", votes: [] },
          { optionId: "2", value: "option2", votes: [] }
        ],
        pollName: "pollNamePOST"
      };

      const token = createJwtCookie(userToUse.id);

      const payload = await request(app)
        .post("/api/polls")
        .send(inputData)
        .set("Accept", "application/json")
        .set("Cookie", token)
        .expect(201);

      const postResponse = JSON.parse(payload.text).poll;

      expect(postResponse).toMatchObject(expectedResponse);
    });
  });

  describe("Testing /api/polls/:id:", () => {
    test("Can I get a specific poll?", async () => {
      const pollToUse = db.getPolls()[0];
      const expectedPoll = getResponsePoll(pollToUse);

      const response = await request(app).get(`/api/polls/${pollToUse.pollId}`);
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
            votes: [creator]
          }
        ],
        pollId: pollToUse.pollId,
        pollName: "pollNameChanged",
        voteLimit,
        isOpen: true
      };

      const token = createJwtCookie(creator.id);

      await request(app)
        .post(`/api/polls/${pollToUse.pollId}/vote`)
        .send({ voterId: creator.id, optionId: "2" })
        .set("Accept", "application/json")
        .set("Cookie", token)
        .expect(200);

      const payload = await request(app)
        .post(`/api/polls/${pollToUse.pollId}`)
        .send(inputData)
        .set("Accept", "application/json")
        .set("Cookie", token)
        .expect(200);

      const postResponse = JSON.parse(payload.text).poll;

      expect(postResponse).toEqual(expectedResponse);
    });

    test("Can I remove a specific poll?", async () => {
      const pollToRemove = db.getPolls()[0];
      const pollId = pollToRemove.pollId;
      // expect(db.getPoll(`${noOfPolls + 1}`).description).toBe("descriptionJed");
      await request(app)
        .delete(`/api/polls/${pollId}`)
        .set("Cookie", createJwtCookie(pollToRemove.creatorId))
        .expect(200);

      expect(db.getPoll(`${pollId}`)).toBeNull();
    });

    test("Am I unable to remove a poll that I didn't create?", async () => {
      const pollToRemove = db.getPolls()[0];
      const userToUse = getAnotherUser(pollToRemove);

      await request(app)
        .delete(`/api/polls/${pollToRemove.pollId}`)
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
    test("Can I vote on a poll and then remove the vote?", async () => {
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

      expect(postResponse.options[0].votes).toEqual([userToUse]);
      expect(postResponse.options[0].votes.length).toBe(1);
      expect(postResponse.options[1].votes).toEqual([]);

      const response2 = await request(app)
        .post(`/api/polls/${pollToVote.pollId}/vote`)
        .send(voteInput)
        .set("Accept", "application/json")
        .set("Cookie", token)
        .expect(200);
      const postResponse2 = JSON.parse(response2.text).poll;

      // expect(postResponse.options[0]).toMatchObject(expectedPolls[1]);
      expect(postResponse2.options[0].votes).toEqual([]);
      expect(postResponse2.options[1].votes).toEqual([]);
    });
  });
});
