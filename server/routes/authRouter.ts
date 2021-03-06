import express from "express";
import passport from "passport";

const authRouter = express.Router();

authRouter.get(
  "/login/github",
  passport.authenticate("github", { scope: ["user:email"], session: false })
);
authRouter.get(
  "/login/github/return",
  passport.authenticate("github", {
    failureRedirect: "/github/callback",
    session: false
  })
);

export default authRouter;
