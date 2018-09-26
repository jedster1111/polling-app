import express = require("express");
import db from "../models/database";

const userRouter = express.Router();

userRouter.route("/").get((req, res) => {
  const ids: string[] = req.params.ids;
  const users = ids ? db.getUsers(ids) : db.getAllUsers();
  res.json({ users });
});
// userRouter.route("");

export default userRouter;
