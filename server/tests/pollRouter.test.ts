import request = require("supertest");
import app from "../app";
import db from "../models/database";
import {
  PollInput,
  PollResponse,
  StoredPoll,
  StoredUser,
  UpdatePollInput,
  VoteInputRequest
} from "../types";
import jedCookie from "./jedCookie";

const generateInputPolls = (n: number) => {
  const polls: PollInput[] = [];
  for (let i = 0; i < n; i++) {
    const index = i + 1;
    polls.push({
      pollName: `pollName${index}`,
      description: `description${index}`,
      creatorId: `${index}`,
      options: ["option1", "option2"]
    });
  }
  return polls;
};
const generateExpectedPolls = (n: number) => {
  const polls: PollResponse[] = [];
  for (let i = 0; i < n; i++) {
    const index = i + 1;
    polls.push({
      pollId: `${index}`,
      pollName: `pollName${index}`,
      description: `description${index}`,
      creator: { displayName: `displayName${index}`, id: `${index}` },
      options: [
        { optionId: "1", value: "option1", votes: [] },
        { optionId: "2", value: "option2", votes: [] }
      ]
    });
  }
  return polls;
};
const generateInputUsers = (n: number) => {
  const users: StoredUser[] = [];
  for (let i = 0; i < n; i++) {
    const index = i + 1;
    users.push({
      id: `${index}`,
      displayName: `displayName${index}`
    });
  }
  return users;
};

describe("Testing poll related routes:", () => {
  const noOfPolls = 3;
  const expectedPolls = generateExpectedPolls(noOfPolls);
  expectedPolls.push({
    creator: { id: "jed", displayName: "Jed" },
    description: "descriptionJed",
    options: [
      { optionId: "1", value: "option1", votes: [] },
      { optionId: "2", value: "option2", votes: [] }
    ],
    pollName: "pollNameJed",
    pollId: `${noOfPolls + 1}`
  });

  beforeEach(() => {
    db.resetPolls();
    db.resetUsers();
    const inputPolls = generateInputPolls(noOfPolls);
    const inputUsers = generateInputUsers(noOfPolls);
    inputPolls.forEach(pollInput => db.insertPoll(pollInput));
    db.insertPoll({
      creatorId: "jed",
      description: "descriptionJed",
      options: ["option1", "option2"],
      pollName: "pollNameJed"
    });
    inputUsers.forEach(userInput => db.insertUser(userInput));
    db.insertUser({ id: "jed", displayName: "Jed" });
  });

  afterEach(() => {
    db.resetPolls();
    db.resetUsers();
  });

  describe("Testing /api/polls:", () => {
    test("Can I get a list of all polls?", async () => {
      const response = await request(app).get("/api/polls");
      const polls: PollResponse[] = response.body.polls;
      expect(polls).toMatchObject(expectedPolls);
      expect(polls[0].pollId).toBeTruthy();
    });
    test("Can I create a poll and will I get it back in the response?", async () => {
      const inputData: PollInput = {
        creatorId: "jed",
        description: "descriptionPOST",
        options: ["option1", "option2"],
        pollName: "pollNamePOST"
      };
      const expectedResponse: PollResponse = {
        description: "descriptionPOST",
        creator: { displayName: "Jed", id: "jed" },
        pollId: `${noOfPolls + 2}`,
        options: [
          { optionId: "1", value: "option1", votes: [] },
          { optionId: "2", value: "option2", votes: [] }
        ],
        pollName: "pollNamePOST"
      };
      const payload = await request(app)
        .post("/api/polls")
        .send(inputData)
        .set("Accept", "application/json")
        .set("Cookie", jedCookie)
        .expect(201);
      const postResponse = JSON.parse(payload.text).poll;
      expect(postResponse).toMatchObject(expectedResponse);
    });
  });

  describe("Testing /api/polls/:id:", () => {
    test("Can I get a specific poll?", async () => {
      const response = await request(app).get("/api/polls/2");
      const responsePoll: StoredPoll = response.body.poll;
      expect(responsePoll).toMatchObject(expectedPolls[1]);
    });

    test("Can I change the properties of a poll without losing votes?", async () => {
      const inputData: UpdatePollInput = {
        pollName: "pollNameChanged",
        options: [
          { optionId: "1", value: "changed1" },
          { optionId: "2", value: "changed2" }
        ]
      };
      const expectedResponse: PollResponse = {
        description: "descriptionJed",
        creator: { id: "jed", displayName: "Jed" },
        options: [
          { optionId: "1", value: "changed1", votes: [] },
          {
            optionId: "2",
            value: "changed2",
            votes: [{ displayName: "Jed", id: "jed" }]
          }
        ],
        pollId: `${noOfPolls + 1}`,
        pollName: "pollNameChanged"
      };
      await request(app)
        .post(`/api/polls/${noOfPolls + 1}/vote`)
        .send({ voterId: "jed", optionId: "2" })
        .set("Accept", "application/json")
        .set("Cookie", jedCookie)
        .expect(200);
      const payload = await request(app)
        .post(`/api/polls/${noOfPolls + 1}`)
        .send(inputData)
        .set("Accept", "application/json")
        .set("Cookie", jedCookie)
        .expect(200);
      const postResponse = JSON.parse(payload.text).poll;
      expect(postResponse).toMatchObject(expectedResponse);
    });

    test("Can I remove a specific poll?", async () => {
      expect(db.getPoll(`${noOfPolls + 1}`).description).toBe("descriptionJed");
      await request(app)
        .delete(`/api/polls/${noOfPolls + 1}`)
        .set("Cookie", jedCookie)
        .expect(200);
      expect(db.getPoll(`${noOfPolls + 1}`)).toBeNull();
    });

    test("Am I unable to remove a poll that I didn't create?", async () => {
      await request(app)
        .delete(`/api/polls/1`)
        .set("Cookie", jedCookie)
        .expect(401);
    });

    test("Am I unable to edit a poll that I didn't create?", async () => {
      await request(app)
        .post(`/api/polls/1`)
        .send({
          pollName: "pollNameChanged",
          options: [
            { optionId: "1", value: "changed1" },
            { optionId: "2", value: "changed2" }
          ]
        })
        .set("Cookie", jedCookie)
        .expect(401);
    });
  });

  describe("Testing /api/polls/:id/vote:", () => {
    test("Can I vote on a poll and then remove it?", async () => {
      const voteInput: VoteInputRequest = { optionId: "1" };
      let response = await request(app)
        .post("/api/polls/2/vote")
        .send(voteInput)
        .set("Accept", "application/json")
        .set("Cookie", jedCookie)
        .expect(200);
      let postResponse: PollResponse = JSON.parse(response.text).poll;
      expect(postResponse.options[0].votes).toEqual([
        { id: "jed", displayName: "Jed" }
      ]);
      expect(postResponse.options[0].votes.length).toBe(1);
      expect(postResponse.options[1].votes).toEqual([]);
      response = await request(app)
        .post("/api/polls/2/vote")
        .send(voteInput)
        .set("Accept", "application/json")
        .set("Cookie", jedCookie)
        .expect(200);
      postResponse = JSON.parse(response.text).poll;
      expect(postResponse).toMatchObject(expectedPolls[1]);
      expect(postResponse.options[0].votes).toEqual([]);
      expect(postResponse.options[1].votes).toEqual([]);
    });
  });
});
