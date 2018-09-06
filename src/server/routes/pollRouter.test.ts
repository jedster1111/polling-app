import request = require("supertest");
import app from "../app";
import pollsModel from "../models/pollsModel";

describe("Test GET /api/polls", () => {
  // adds test data before each test
  beforeEach(() => {
    pollsModel.insert({ name: "test", creator: "Jed" });
    pollsModel.insert({ name: "test2", creator: "Roy" });
  });
  afterEach(() => {
    // cleans up test data after each test
    pollsModel.removeDataOnly();
  });
  test("GET should respond with 200 and json in body", async () => {
    const response = await request(app).get("/api/polls");
    const responseCleaned = response.body.map((poll: any) => {
      return { name: poll.name, creator: poll.creator };
    });
    expect(response.status).toBe(200);
    expect(responseCleaned).toMatchObject([
      { name: "test", creator: "Jed" },
      { name: "test2", creator: "Roy" }
    ]);
  });
});
