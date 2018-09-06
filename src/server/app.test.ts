import request = require("supertest");
import app from "./app";

describe("Test the api route", () => {
  test("Is should respond with GET method", () => {
    return request(app)
      .get("/api/polls")
      .expect(200);
  });
});
