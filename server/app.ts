import bodyParser = require("body-parser");
import cookieParser = require("cookie-parser");
import express = require("express");
import { ErrorRequestHandler } from "express";
import jwt = require("jsonwebtoken");
import passport = require("passport");
export import passport = require("passport");
import { Strategy } from "passport-github2";
// import session = require("express-session");
// import morgan = require("morgan");
import passportJwt = require("passport-jwt");
import path = require("path");
import * as secrets from "../secret/github";
import db from "./models/database";
// import authRouter from "./routes/authRouter";
import pollRouter from "./routes/pollRouter";
import userRouter from "./routes/userRouter";

export interface ErrorWithStatusCode extends Error {
  statusCode?: number;
}
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
const jwtCookieExtractor = (req: express.Request) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.jwt;
  }
  return token;
};
const jwtOptions: passportJwt.StrategyOptions = {
  jwtFromRequest: jwtCookieExtractor,
  secretOrKey: secrets.secret
  // issuer: config.get('authentication.token.issuer'),
  // audience: config.get('authentication.token.audience')
};
const generateAccessToken = (userId: string) => {
  const expiresIn = "1 hour";
  const secret = secrets.secret;
  const token = jwt.sign({}, secret, {
    expiresIn,
    subject: userId
  });
  return token;
};
passport.use(
  new passportJwt.Strategy(jwtOptions, (payload, done) => {
    const user = db.getUser(payload.sub);
    if (user) {
      return done(null, user, payload);
    } else {
      return done(new Error("No user found"));
    }
  })
);
passport.use(
  new Strategy(
    {
      clientID: secrets.clientId,
      clientSecret: secrets.clientSecret,
      callbackURL: "http://127.0.0.1:8000/auth/github/callback"
    },
    (accessToken: any, refreshToken: any, profile: any, done: any) => {
      const cleanedProfile = {
        id: profile.id,
        displayName: profile.displayName,
        userName: profile.username,
        emails: profile.emails
      };
      const user = db.getUser(profile.id) || db.insertUser(cleanedProfile);
      console.log(user);
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

// app.use(
//   session({
//     secret: secrets.secret,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: true,
//       httpOnly: true
//     }
//   })
// );
// app.use(morgan("combined"));
// app.use(passport.session());
app.use(cookieParser());
app.use(express.static(path.resolve("dist")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());

app.use("/api/polls", pollRouter);
app.use("/api/users", userRouter);

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"], session: false })
);
app.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    session: false
  }),
  (req, res) => {
    const token = generateAccessToken(req.user.id);
    res.cookie("jwt", token, { httpOnly: true });
    res.redirect("/");
  }
);
app.get("/auth/logout", (req, res) => {
  req.logout();
  res
    .status(200)
    .clearCookie("jwt")
    .redirect("/");
});
app.get(
  "/auth",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.status(200).json({ userData: req.user });
  }
);
app.get(
  "/test",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.json({ status: "Logged in!", user: req.user });
  }
);

app.use(errorHandlerMiddleware);

export default app;
