import db from "../models/database";
import { StoredUser } from "../types";

const generateUsers = (n: number) => {
  const users: StoredUser[] = [];
  for (let i = 0; i < n; i++) {
    const index = i + 1;
    users.push({ id: `${index}`, displayName: `displayName${index}` });
  }
  return users;
};

describe("Testing user related database methods:", () => {
  const numberOfUsers = 3;

  beforeEach(() => {
    const users = generateUsers(numberOfUsers);
    db.resetUsers();
    users.forEach(user => db.insertUser(user));
  });
  afterEach(() => {
    db.resetUsers();
  });

  describe("Testing getUser and insertUser:", () => {
    test("Can I add a user?", () => {
      const user = db.insertUser(generateUsers(1)[0]);
      expect(user).toMatchObject(generateUsers(1)[0]);
    });

    test("Can I get a user by Id?", () => {
      const userToGet = db.getAllUsers()[0];
      const user = db.getUser(userToGet.id);
      expect(user).toMatchObject(userToGet);
    });
  });

  describe("Testing getUsers:", () => {
    test("Can I get an array of users by ids?", () => {
      const storedUsers = db.getAllUsers();
      const ids = [storedUsers[0].id, storedUsers[1].id];
      const users = db.getUsers(ids);
      expect(users).toMatchObject([storedUsers[0], storedUsers[1]]);
    });
  });

  describe("Testing getAllUsers", () => {
    test("Can I get all users?", () => {
      const users = db.getAllUsers();
      expect(users).toMatchObject(generateUsers(numberOfUsers));
    });
  });

  describe("Testing resetUsers:", () => {
    test("Can I remove all existing users?", () => {
      db.resetUsers();
      expect(db.getAllUsers()).toEqual([]);
    });
  });
});
