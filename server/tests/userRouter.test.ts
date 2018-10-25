import request from "supertest";
import uuid from "uuid/v1";
import app from "../app";
import db from "../models/database";
import createJwtCookie from "./createJwtCookie";

describe("Testing user related routes:", () => {
  beforeEach(() => {
    db.resetUsers();
    db.insertUser({ id: "1", displayName: "Jed Thompson" });
    db.insertUser({ id: "2", displayName: "Josh Lee" });
    db.insertUser({ id: "3", displayName: "Joy" });
  });
  afterEach(() => db.resetUsers());

  describe("Testing /api/users:", () => {
    test("Can I get a list of all users?", async () => {
      const storedUsers = db.getAllUsers();

      const response = await request(app)
        .get("/api/users")
        .expect(200);
      const users = response.body.users;

      expect(users).toMatchObject(storedUsers);
    });

    test("Can I get specific user with params?", async () => {
      const storedUsers = db.getAllUsers();

      const response = await request(app)
        .get("/api/users")
        .query({ ids: storedUsers[0].id });
      const users = response.body.users;

      expect(users).toHaveLength(1);
      expect(users).toMatchObject([storedUsers[0]]);
    });

    test("Can I get list of users with params?", async () => {
      const storedUsers = db.getAllUsers();
      const usersToFind = [storedUsers[0], storedUsers[2]];

      const response = await request(app)
        .get("/api/users")
        .query({ ids: usersToFind.map(user => user.id) });
      const users = response.body.users;

      expect(users).toHaveLength(2);
      expect(users).toMatchObject(usersToFind);
    });
  });

  describe("Testing /api/users/:id:", () => {
    test("Can I get a specific users data?", async () => {
      const storedUsers = db.getAllUsers();

      const response = await request(app).get(
        `/api/users/${storedUsers[0].id}`
      );
      const user = response.body.user;

      expect(user).toMatchObject(storedUsers[0]);

      const response2 = await request(app).get(
        `/api/users/${storedUsers[1].id}`
      );
      const user2 = response2.body.user;

      expect(user2).toMatchObject(storedUsers[1]);
    });

    test("Do I get null if I request a non-existent user?", async () => {
      const idToCheck = uuid();

      const response = await request(app).get(`/api/users/${idToCheck}`);
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
      const storedUsers = db.getAllUsers();
      const userToUse = storedUsers[0];

      const response = await request(app)
        .get("/api/users/me")
        .set("Cookie", createJwtCookie(userToUse.id))
        .expect(200);
      const user = response.body.user;

      expect(user).toMatchObject(userToUse);
    });
  });
});
