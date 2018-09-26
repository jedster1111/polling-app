import express = require("express");
import db from "../models/database";

const userRouter = express.Router();

userRouter.route("/").get((req, res) => {
  const ids = req.query.ids;
  const users = ids // Not sure if this is too unreadable
    ? Array.isArray(ids)
      ? db.getUsers(ids)
      : [db.getUser(ids)]
    : db.getAllUsers();
  res.json({ users });
});
userRouter.route("/:id").get((req, res) => {
  const id = req.params.id;
  const user = db.getUser(id);
  res.json({ user });
});

export default userRouter;
