import request = require("supertest");
import app from "../app";
import db, { Poll, PollInput, UpdatePollInput } from "../models/database";

beforeEach(() => {
  db.reset();
  db.insertPoll({
    creatorName: "creatorName1",
    description: "description1",
    options: ["option1"],
    pollName: "pollName1"
  });
  db.insertPoll({
    creatorName: "creatorName2",
    description: "description2",
    options: ["option1", "option2"],
    pollName: "pollName2"
  });
});
afterEach(() => db.reset());

describe("Test GET /api/polls", () => {
  test("Should respond with array of polls", async () => {
    const response = await request(app).get("/api/polls");
    const polls: Poll[] = response.body.polls;
    expect(polls).toMatchObject([
      {
        creatorName: "creatorName1",
        description: "description1",
        options: [{ optionId: "1", value: "option1", votes: [] }],
        pollName: "pollName1"
      },
      {
        creatorName: "creatorName2",
        description: "description2",
        options: [
          { optionId: "1", value: "option1", votes: [] },
          { optionId: "2", value: "option2", votes: [] }
        ],
        pollName: "pollName2"
      }
    ]);
    expect(polls[0].pollId).toBeTruthy();
  });
});

describe("Test POST /api/polls", () => {
  test("Creates and then returns new poll", async () => {
    const inputData: PollInput = {
      creatorName: "creatorNamePOST",
      description: "descriptionPOST",
      options: ["option1", "option2"],
      pollName: "pollNamePOST"
    };
    const expectedResponse = {
      creatorName: "creatorNamePOST",
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
    expect(postResponse).toMatchObject(
      db.getPoll({ pollName: "pollNamePOST" })
    );
  });
});

describe("Test GET /api/polls/:id", () => {
  test("Returns a specific poll identified with pollId", async () => {
    const response = await request(app).get("/api/polls/2");
    const responsePoll: Poll = response.body.poll;
    const dbPoll: Poll = db.getPoll({ pollId: "2" });
    expect(responsePoll).toMatchObject(dbPoll);
  });
});

describe("Test POST /api/polls/:id", () => {
  test("Changes the properties of a poll, excluding options", async () => {
    const inputData: UpdatePollInput = {
      creatorName: "creatorNameChanged",
      pollName: "pollNameChanged"
    };
    const expectedResponse: Poll = {
      creatorName: "creatorNameChanged",
      description: "description1",
      options: [{ optionId: "1", value: "option1", votes: [] }],
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
describe("Test DELETE /api/polls/:id", () => {
  test("Poll with Id 1 is removed", async () => {
    expect(db.getPoll({ pollId: "1" }).creatorName).toBe("creatorName1");
    await request(app)
      .delete("/api/polls/1")
      .expect(200);
    expect(db.getPoll({ pollId: 1 })).toBeNull();
  });
});
