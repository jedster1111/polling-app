import bodyParser = require("body-parser");
import cookieParser = require("cookie-parser");
import { ErrorRequestHandler } from "express";
import express = require("express");
import session = require("express-session");
import morgan = require("morgan");
export import passport = require("passport");
import passport = require("passport");
import { Strategy } from "passport-github";
import path = require("path");
import * as secrets from "../secret/github";
import db from "./models/database";
// import authRouter from "./routes/authRouter";
import pollRouter from "./routes/pollRouter";

export interface ErrorWithStatusCode extends Error {
  statusCode?: number;
}
const ensureAuthenticated: express.Handler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};
const errorHandlerMiddleware: ErrorRequestHandler = (
  err: ErrorWithStatusCode,
  req,
  res,
  next
) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  console.log("Something went wrong!");
  console.error(err);
  res.status(err.statusCode).json({ error: err.message });
  console.log("Carrying on then...");
};

passport.use(
  new Strategy(
    {
      clientID: secrets.clientId,
      clientSecret: secrets.clientSecret,
      callbackURL: "http://127.0.0.1:8000/auth/github/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      const user = db.getUser(profile.id) || db.insertUser(profile);
      return done(null, user);
    }
  )
);
passport.serializeUser<any, any>((user, done) => {
  done(null, user.id);
});
passport.deserializeUser<any, string>((id, done) => {
  const user = db.getUser(id);
  if (!user) {
    return done(new Error(`User with id of ${id} was not found`));
  }
  done(null, user);
});

const app = express();

app.use(
  session({
    secret: secrets.secret,
    resave: true,
    saveUninitialized: true
  })
);
app.use(morgan("combined"));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.resolve("dist")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/polls", pollRouter);

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);
app.get("/test", ensureAuthenticated, (req, res, next) => {
  res.render("you are authenticated");
});

app.use(errorHandlerMiddleware);

export default app;
