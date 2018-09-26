import express = require("express");
import db from "../models/database";

const userRouter = express.Router();

userRouter.route("/").get((req, res) => {
  const users = db.getUsers();
  res.json({ users });
});

export default userRouter;
