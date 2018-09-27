import request = require("supertest");
import app from "../app";
import db from "../models/database";
import { StoredUser } from "../types";

describe("Testing user api endpoints", () => {
  const result = [
    { id: "1", displayName: "Jed Thompson" },
    { id: "2", displayName: "Josh Lee" },
    { id: "3", displayName: "Joy" }
  ];
  beforeEach(() => {
    db.insertUser({ id: "1", displayName: "Jed Thompson" });
    db.insertUser({ id: "2", displayName: "Josh Lee" });
    db.insertUser({ id: "3", displayName: "Joy" });
  });
  afterEach(() => db.resetUsers());
  describe("/api/users", () => {
    test("Can get all user data", async () => {
      const response = await request(app).get("/api/users");
      const users: StoredUser[] = response.body.users;
      expect(users).toMatchObject(result);
    });
    test("Can get specific user data with params", async () => {
      const response = await request(app)
        .get("/api/users")
        .query({ ids: "1" });
      const users = response.body.users;
      expect(users).toHaveLength(1);
      expect(users).toMatchObject([result[0]]);
    });
    test("Can get array of users' data using params", async () => {
      const response = await request(app)
        .get("/api/users")
        .query({ ids: ["1", "3"] });
      const users = response.body.users;
      expect(users).toHaveLength(2);
      expect(users).toMatchObject([result[0], result[2]]);
    });
  });
  // describe("/api/users/me", () => {
  // TODO: Test OAUTH authentication
  // });
  describe("/api/users/:id", () => {
    test("Can get a user's data by id", async () => {
      const response = await request(app).get("/api/users/1");
      const user = response.body.user;
      expect(user).toMatchObject(result[0]);
      const response2 = await request(app).get("/api/users/2");
      const user2 = response2.body.user;
      expect(user2).toMatchObject(result[1]);
    });
    test("Requesting a non existent id returns null", async () => {
      const response = await request(app).get("/api/users/5");
      const user = response.body.user;
      expect(user).toBeNull();
    });
  });
});
