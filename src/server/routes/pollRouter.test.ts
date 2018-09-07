import request = require("supertest");
import app from "../app";
import db, { PollInput } from "../models/database";

describe("Test GET /api/polls", () => {
  // adds test data before each test
  beforeEach(() => {
    db.insertPoll({
      creatorName: "Jed",
      description: "hey there",
      options: ["bean bags"],
      pollName: "test"
    });
  });
  afterEach(() => {
    // cleans up test data after each test
    db.removeAllPollsData();
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
    expect(response.body).toMatchObject([
      {
        creatorName: "Jed",
        description: "hey there",
        options: [{ optionId: "1", value: "bean bags", votes: [] }],
        pollId: "1",
        pollName: "test"
      }
    ]);
  });
});
describe("Test POST /api/polls", () => {
  afterEach(() => {
    // cleans up test data after each test
    db.removeAllPollsData();
  });
  test("tests if POST request with json adds to database", async () => {
    const inputData: PollInput = {
      creatorName: "Jed",
      description: "hey test",
      options: ["chair", "bench"],
      pollName: "test"
    };
    await request(app)
      .post("/api/polls")
      .send(inputData)
      .set("Accept", "application/json")
      .expect(200);
    const dbResult = db.getPoll({ pollName: "test" });
    if (!dbResult) {
      throw new Error("Entry wasn't created");
    }
    // check if input was stored into database correctly
    expect(dbResult).toMatchObject({
      creatorName: "Jed",
      description: "hey test",
      options: [
        { optionId: "1", value: "chair", votes: [] },
        { optionId: "2", value: "bench", votes: [] }
      ],
      pollId: "1",
      pollName: "test"
    });
  });
});
