import express = require("express");
import passport = require("passport");

const authRouter = express.Router();

authRouter.get(
  "/login/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
authRouter.get(
  "/login/github/return",
  passport.authenticate("github", { failureRedirect: "/github/callback" })
);

export default authRouter;
