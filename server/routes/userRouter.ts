import express from "express";
import passport from "passport";
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
userRouter
  .route("/me")
  .get(passport.authenticate(["jwt"], { session: false }), (req, res) => {
    res.send({ user: req.user });
  });
userRouter.route("/:id").get((req, res) => {
  const id = req.params.id;
  const user = db.getUser(id);
  res.json({ user });
});
// An example of how to authenticate an api request
// userRouter.route("/:id").get((req, res) => {
//   const id = req.params.id;
//   if (req.user && req.user.id === id) {
//     const user = db.getUser(id);
//     res.json({ user });
//   } else {
//     res.status(401).json({ value: "not your account" });
//   }
// });

export default userRouter;
