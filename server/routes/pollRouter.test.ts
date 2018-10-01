import request = require("supertest");
import app from "../app";
import { inputPollData, inputUserData } from "../inputData";
import db from "../models/database";
import {
  PollInput,
  PollResponse,
  StoredPoll,
  UpdatePollInput,
  VoteInputRequest
} from "../types";
import jedCookie from "./jedCookie";

const expectedResults: PollResponse[] = [
  {
    pollId: "1",
    pollName: "pollName1",
    description: "description1",
    creator: { displayName: "displayName1", id: "1" },
    options: [
      { optionId: "1", value: "option1", votes: [] },
      { optionId: "2", value: "option2", votes: [] }
    ]
  },
  {
    pollId: "2",
    pollName: "pollName2",
    creator: { displayName: "displayName2", id: "2" },
    description: "description2",
    options: [
      { optionId: "1", value: "option1", votes: [] },
      { optionId: "2", value: "option2", votes: [] }
    ]
  },
  {
    pollId: "3",
    pollName: "pollName3",
    creator: { displayName: "Jed", id: "25291974" },
    description: "description3",
    options: [
      { optionId: "1", value: "option1", votes: [] },
      { optionId: "2", value: "option2", votes: [] }
    ]
  }
];

beforeEach(() => {
  db.resetPolls();
  // have to create copy as lokiJs will add properties to object when added to collection
  inputPollData.forEach(pollInput =>
    db.insertPoll(Object.assign({}, pollInput))
  );
  inputUserData.forEach(userInput =>
    db.insertUser(Object.assign({}, userInput))
  );
});
afterEach(() => {
  db.resetPolls();
  db.resetUsers();
});

test("Should respond with array of polls", async () => {
  const response = await request(app).get("/api/polls");
  const polls: PollResponse[] = response.body.polls;
  expect(polls).toMatchObject([
    expectedResults[0],
    expectedResults[1],
    expectedResults[2]
  ]);
  expect(polls[0].pollId).toBeTruthy();
});

test("Creates and then returns new poll", async () => {
  const inputData: PollInput = {
    creatorId: "1",
    description: "descriptionPOST",
    options: ["option1", "option2"],
    pollName: "pollNamePOST"
  };
  const expectedResponse: PollResponse = {
    description: "descriptionPOST",
    creator: { displayName: "Jed", id: "25291974" },
    pollId: `${expectedResults.length + 1}`,
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
  // console.log(payload);
  expect(postResponse).toMatchObject(expectedResponse);
});

test("Returns a specific poll identified with pollId", async () => {
  const response = await request(app).get("/api/polls/2");
  const responsePoll: StoredPoll = response.body.poll;
  expect(responsePoll).toMatchObject(expectedResults[1]);
});

test("Voting endpoint is working", async () => {
  const voteInput: VoteInputRequest = { optionId: "1" };
  let response = await request(app)
    .post("/api/polls/2/vote")
    .send(voteInput)
    .set("Accept", "application/json")
    .set("Cookie", jedCookie)
    .expect(200);
  let postResponse: PollResponse = JSON.parse(response.text).poll;
  expect(postResponse.options[0].votes).toEqual([
    { id: "25291974", displayName: "Jed" }
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
  expect(postResponse).toMatchObject(expectedResults[1]);
  expect(postResponse.options[0].votes).toEqual([]);
  expect(postResponse.options[1].votes).toEqual([]);
});

test("Changes the properties of a poll and doesn't lose votes", async () => {
  const inputData: UpdatePollInput = {
    pollName: "pollNameChanged",
    options: [
      { optionId: "1", value: "changed1" },
      { optionId: "2", value: "changed2" }
    ]
  };
  const expectedResponse: PollResponse = {
    description: "description3",
    creator: { id: "25291974", displayName: "Jed" },
    options: [
      { optionId: "1", value: "changed1", votes: [] },
      {
        optionId: "2",
        value: "changed2",
        votes: [{ displayName: "Jed", id: "25291974" }]
      }
    ],
    pollId: "3",
    pollName: "pollNameChanged"
  };
  await request(app)
    .post(`/api/polls/${expectedResults.length}/vote`)
    .send({ voterId: "25291974", optionId: "2" })
    .set("Accept", "application/json")
    .set("Cookie", jedCookie)
    .expect(200);
  const payload = await request(app)
    .post(`/api/polls/${expectedResults.length}`)
    .send(inputData)
    .set("Accept", "application/json")
    .set("Cookie", jedCookie)
    .expect(200);
  const postResponse = JSON.parse(payload.text).poll;
  expect(postResponse).toMatchObject(expectedResponse);
});
test("Poll with Id 3 is removed", async () => {
  expect(db.getPoll({ pollId: "3" }).description).toBe("description3");
  await request(app)
    .delete("/api/polls/3")
    .set("Cookie", jedCookie)
    .expect(200);
  expect(db.getPoll({ pollId: "3" })).toBeNull();
});
test("Can't edit poll that you didn't create", async () => {
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
test("Can't delete poll that you didn't create", async () => {
  await request(app)
    .delete(`/api/polls/1`)
    .set("Cookie", jedCookie)
    .expect(401);
});
