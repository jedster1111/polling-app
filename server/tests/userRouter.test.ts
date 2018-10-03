import request = require("supertest");
import app from "../app";
import db from "../models/database";
import { StoredUser } from "../types";
import jedCookie from "./jedCookie";

describe("Testing user related routes:", () => {
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

  describe("Testing /api/users:", () => {
    test("Can I get a list of all users?", async () => {
      const response = await request(app).get("/api/users");
      const users: StoredUser[] = response.body.users;
      expect(users).toMatchObject(result);
    });

    test("Can I get specific user with params?", async () => {
      const response = await request(app)
        .get("/api/users")
        .query({ ids: "1" });
      const users = response.body.users;
      expect(users).toHaveLength(1);
      expect(users).toMatchObject([result[0]]);
    });

    test("Can I get list of users with params?", async () => {
      const response = await request(app)
        .get("/api/users")
        .query({ ids: ["1", "3"] });
      const users = response.body.users;
      expect(users).toHaveLength(2);
      expect(users).toMatchObject([result[0], result[2]]);
    });
  });

  describe("Testing /api/users/:id:", () => {
    test("Can I get a specific users data?", async () => {
      const response = await request(app).get("/api/users/1");
      const user = response.body.user;
      expect(user).toMatchObject(result[0]);
      const response2 = await request(app).get("/api/users/2");
      const user2 = response2.body.user;
      expect(user2).toMatchObject(result[1]);
    });

    test("Do I get null if I request a non-existent user?", async () => {
      const response = await request(app).get("/api/users/5");
      const user = response.body.user;
      expect(user).toBeNull();
    });
  });

  describe("Testing /api/users/me:", () => {
    test("Do requests with no auth results in 401?", async () => {
      const response = await request(app).get("/api/users/me");
      expect(response.status).toBe(401);
    });

    test("Can I send a request with jwt in cookie and get my user data?", async () => {
      db.insertUser({ id: "jed", displayName: "Jed" });
      const response = await request(app)
        .get("/api/users/me")
        .set("Cookie", jedCookie);
      expect(response.body.user.id).toBe("jed");
      expect(response.body.user.displayName).toBe("Jed");
    });
  });
});
