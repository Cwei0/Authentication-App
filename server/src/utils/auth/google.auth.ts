import passport from "passport";
import { Strategy } from "passport-google-oauth20";

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {});

const googleStrategy = new Strategy(
  {
    clientID: "",
    clientSecret: "",
    callbackURL: "",
  },
  (accessToken, verifyToken, profile, cb) => {}
);

passport.use(googleStrategy);
