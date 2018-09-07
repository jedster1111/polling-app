import request = require("supertest");
import app from "../app";
import db, { Poll, PollInput, UpdatePollInput } from "../models/database";

describe("Test GET /api/polls", () => {
  // adds test data before each test
  beforeEach(() => {
    db.reset();
    db.insertPoll({
      creatorName: "Jed",
      description: "hey there",
      options: ["bean bags"],
      pollName: "test"
    });
    db.insertPoll({
      creatorName: "James",
      description: "testing again",
      options: ["banana", "orange"],
      pollName: "fruit"
    });
  });
  afterEach(() => {
    // cleans up test data after each test
    db.reset();
  });
  test("GET should respond with 200 and json in body", async () => {
    const response = await request(app)
      .get("/api/polls")
      .expect("Content-Type", /json/);
    // const responseCleaned = response.body.map((poll: any) => {
    //   return { name: poll.name, creator: poll.creator };
    // });
    expect(response.status).toBe(200);
  });
  test("GET should respond with array of polls", async () => {
    const response = await request(app).get("/api/polls");
    const polls: Poll[] = response.body.polls;
    expect(polls).toMatchObject([
      {
        creatorName: "Jed",
        description: "hey there",
        options: [{ optionId: "1", value: "bean bags", votes: [] }],
        pollName: "test"
      },
      {
        creatorName: "James",
        description: "testing again",
        options: [
          { optionId: "1", value: "banana", votes: [] },
          { optionId: "2", value: "orange", votes: [] }
        ],
        pollName: "fruit"
      }
    ]);
    expect(polls[0].pollId).toBeTruthy();
  });
});

describe("Test POST /api/polls", () => {
  beforeEach(() => db.reset());
  afterEach(() => db.reset());

  test("tests if POST request returns new poll", async () => {
    const inputData: PollInput = {
      creatorName: "Jed",
      description: "hey test",
      options: ["chair", "bench"],
      pollName: "test"
    };
    const expectedResponse = {
      creatorName: "Jed",
      description: "hey test",
      options: [
        { optionId: "1", value: "chair", votes: [] },
        { optionId: "2", value: "bench", votes: [] }
      ],
      pollName: "test"
    };
    const payload = await request(app)
      .post("/api/polls")
      .send(inputData)
      .set("Accept", "application/json")
      .expect(201);
    const postResponse = JSON.parse(payload.text).poll;
    // console.log(payload);
    expect(postResponse).toMatchObject(expectedResponse);
    expect(postResponse).toMatchObject(db.getPoll({ pollName: "test" }));
  });
});

describe("Test GET /api/polls/:id", () => {
  beforeEach(() => {
    db.reset();
    db.insertPoll({
      creatorName: "Jed",
      description: "hey there",
      options: ["bean bags"],
      pollName: "test"
    });
    db.insertPoll({
      creatorName: "James",
      description: "testing again",
      options: ["banana", "orange"],
      pollName: "fruit"
    });
  });
  afterEach(() => db.reset());
  test("You can get a poll by Id", async () => {
    const response = await request(app).get("/api/polls/2");
    const responsePoll: Poll = response.body.poll;
    const dbPoll: Poll = db.getPoll({ pollId: "2" });
    expect(responsePoll).toMatchObject(dbPoll);
  });
});

describe("Test POST /api/polls/:id", () => {
  beforeEach(() => {
    db.reset();
    db.insertPoll({
      creatorName: "Jed",
      description: "hey there",
      options: ["bean bags"],
      pollName: "test"
    });
    db.insertPoll({
      creatorName: "James",
      description: "testing again",
      options: ["banana", "orange"],
      pollName: "fruit"
    });
  });
  afterEach(() => db.reset());
  test("You can change properties of a poll, excluding options", async () => {
    const inputData: UpdatePollInput = {
      creatorName: "creatorNameChanged",
      pollName: "pollNameChanged"
    };
    const expectedResponse: Poll = {
      creatorName: "creatorNameChanged",
      description: "hey there",
      options: [{ optionId: "1", value: "bean bags", votes: [] }],
      pollId: "1",
      pollName: "pollNameChanged"
    };
    const payload = await request(app)
      .post("/api/polls/1")
      .send(inputData)
      .set("Accept", "application/json")
      .expect(200);
    const postResponse = JSON.parse(payload.text).poll;
    expect(postResponse).toMatchObject(expectedResponse);
    expect(postResponse).toMatchObject(db.getPoll({ pollId: "1" }));
  });
});
