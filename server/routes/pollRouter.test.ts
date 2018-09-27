import request = require("supertest");
import app from "../app";
import { inputPollData, inputUserData } from "../inputData";
import db from "../models/database";
import {
  PollInput,
  PollResponse,
  StoredPoll,
  UpdatePollInput,
  VoteInput
} from "../types";

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
  const expectedPolls: PollResponse[] = [
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
    }
  ];
  expect(polls).toMatchObject(expectedPolls);
  expect(polls[0].pollId).toBeTruthy();
});

test("Creates and then returns new poll", async () => {
  const inputData: PollInput = {
    creatorId: "1",
    description: "descriptionPOST",
    options: ["option1", "option2"],
    pollName: "pollNamePOST"
  };
  const expectedResponse = {
    creatorId: "1",
    description: "descriptionPOST",
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
    .expect(201);
  const postResponse = JSON.parse(payload.text).poll;
  // console.log(payload);
  expect(postResponse).toMatchObject(expectedResponse);
  expect(postResponse).toMatchObject(db.getPoll({ pollName: "pollNamePOST" }));
});

test("Returns a specific poll identified with pollId", async () => {
  const response = await request(app).get("/api/polls/2");
  const responsePoll: StoredPoll = response.body.poll;
  const dbPoll: StoredPoll = db.getPoll({ pollId: "2" });
  expect(responsePoll).toMatchObject(dbPoll);
});

test("Voting endpoint is working", async () => {
  const voteInput: VoteInput = { voterId: "1", optionId: "1" };
  let response = await request(app)
    .post("/api/polls/2/vote")
    .send(voteInput)
    .set("Accept", "application/json")
    .expect(200);
  let postResponse: PollResponse = JSON.parse(response.text).poll;
  expect(postResponse.options[0].votes).toEqual([
    { id: "1", displayName: "displayName1" }
  ]);
  expect(postResponse.options[0].votes.length).toBe(1);
  expect(postResponse.options[1].votes).toEqual([]);
  response = await request(app)
    .post("/api/polls/2/vote")
    .send(voteInput)
    .set("Accept", "application/json")
    .expect(200);
  postResponse = JSON.parse(response.text).poll;
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
    description: "description1",
    creator: { id: "1", displayName: "displayName1" },
    options: [
      { optionId: "1", value: "changed1", votes: [] },
      {
        optionId: "2",
        value: "changed2",
        votes: [{ displayName: "displayName1", id: "1" }]
      }
    ],
    pollId: "1",
    pollName: "pollNameChanged"
  };
  await request(app)
    .post("/api/polls/1/vote")
    .send({ voterId: "1", optionId: "2" })
    .set("Accept", "application/json")
    .expect(200);
  const payload = await request(app)
    .post("/api/polls/1")
    .send(inputData)
    .set("Accept", "application/json")
    .expect(200);
  const postResponse = JSON.parse(payload.text).poll;
  expect(postResponse).toMatchObject(expectedResponse);
});
test("Poll with Id 1 is removed", async () => {
  expect(db.getPoll({ pollId: "1" }).description).toBe("description1");
  await request(app)
    .delete("/api/polls/1")
    .expect(200);
  expect(db.getPoll({ pollId: 1 })).toBeNull();
});
