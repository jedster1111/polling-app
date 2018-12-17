import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import { ErrorRequestHandler } from "express";
import { Request } from "express-serve-static-core";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy } from "passport-github2";
import { OAuth2Strategy, Profile } from "passport-google-oauth";
import passportJwt from "passport-jwt";
import { VerifyCallback } from "passport-oauth2";
import path from "path";
import db from "./models/database";
import pollRouter from "./routes/pollRouter";
import userRouter from "./routes/userRouter";

const ENV = process.env.NODE_ENV || "development";

if (ENV === "development") {
  dotenv.config({ path: path.resolve(__dirname, "..", "dev.env") });
} else {
  dotenv.config({ path: path.resolve(__dirname, "..", "..", "prod.env") });
}

const BASE_URL = process.env.POLLING_APP_URL || "http://127.0.0.1:8000";
const secretKey = process.env.SECRET_KEY || "SuperSecretKey";
const githubClientId = process.env.GITHUB_CLIENT_ID || "GithubProvidedClientId";
const githubClientSecret =
  process.env.GITHUB_CLIENT_SECRET || "GithubProvidedSecretKey";

const googleClientId = process.env.GOOGLE_CLIENT_ID || "GoogleProvidedClientId";
const googleClientSecret =
  process.env.GOOGLE_CLIENT_SECRET || "GoogleProvidedClientSecret";

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
  res.status(err.statusCode).json({ error: err.message });
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
  secretOrKey: secretKey
};
export const generateAccessToken = (userId: string) => {
  const expiresIn = "1 hour";
  const secret = secretKey;
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

interface GithubUser {
  id: string;
  displayName?: string;
  username: string;
  photos?: Array<{ value: string }>;
  profileUrl?: string;
  emails: Array<{ value: string }>;
}

const githubCallbackUrl = `${BASE_URL}/auth/github/callback`;
const googleCallbackUrl = `${BASE_URL}/auth/google/callback`;

passport.use(
  new Strategy(
    {
      clientID: githubClientId,
      clientSecret: githubClientSecret,
      callbackURL: githubCallbackUrl,
      passReqToCallback: true
    },
    (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: GithubUser,
      done: VerifyCallback
    ) => {
      const cleanedProfile = {
        id: `GITHUB_${profile.id}`,
        displayName: profile.displayName,
        userName: profile.username,
        emails: profile.emails,
        photos: profile.photos,
        profileUrl: profile.profileUrl
      };
      const user = db.getUser(profile.id) || db.insertUser(cleanedProfile);
      return done(null, user);
    }
  )
);

passport.use(
  new OAuth2Strategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: googleCallbackUrl,
      passReqToCallback: true
    },
    (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      const cleanedProfile = {
        id: `GOOGLE_${profile.id}`,
        displayName: profile.displayName,
        userName: profile.username,
        emails: profile.emails,
        photos: profile.photos
      };
      const user = db.getUser(profile.id) || db.insertUser(cleanedProfile);
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

app.use(cookieParser());
app.use(express.static(path.resolve("dist")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());

app.use("/api/polls", pollRouter);
app.use("/api/users", userRouter);

app.get(
  "/auth/github",
  (req, res, next) => {
    res.cookie("originalUrl", req.headers.referer);
    next();
  },
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
    res.redirect(
      !req.cookies.originalUrl || req.cookies.originalUrl === "undefined"
        ? "/"
        : req.cookies.originalUrl
    );
  }
);

app.get(
  "/auth/google",
  (req, res, next) => {
    res.cookie("originalUrl", req.headers.referer);
    next();
  },
  passport.authenticate("google", { scope: ["profile"] })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false
  }),
  (req, res) => {
    const token = generateAccessToken(req.user.id);
    res.cookie("jwt", token, { httpOnly: true });
    res.redirect(
      !req.cookies.originalUrl || req.cookies.originalUrl === "undefined"
        ? "/"
        : req.cookies.originalUrl
    );
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
