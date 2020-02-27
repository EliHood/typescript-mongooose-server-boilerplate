import "dotenv/config";
import passport from "passport";
import LocalStrategy from "passport-local";
import * as db from "../models";

const Local = LocalStrategy.Strategy;

passport.use(
  "register",
  new Local(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
      session: false
    },
    async (req, username, password, done) => {
      try {
        const foundUsername = await db.User.findOne({
          username: req.body.username
        });
        if (foundUsername) {
          return done(null, true, {
            message: `username: ${req.body.username} already taken`
          });
        }
        await db.User.findOne({
          email: req.body.email
        }).then(async user => {
          console.log(user);
          if (user != null) {
            done(null, true, {
              message: `email: ${req.body.email} already taken`
            });
          } else {
            const user = await new db.User({
              username: req.body.username,
              email: req.body.email,
              password: req.body.password
            });

            await user.save(err => {
              if (err) {
                return done(null, false, {
                  message: err
                });
              } else {
                console.log("user created");
                return done(null, user);
              }
            });
          }
        });
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  "login",
  new Local(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
      session: false
    },
    async (req, username, password, done) => {
      try {
        await db.User.findOne({
          username: username
        }).then(async user => {
          if (user === null) {
            return done(null, false, { message: "Username doesn't exist" });
          } else {
            // console.log(password, username);
            const passwordMatch = await user.comparePass(req.body.password);
            if (!passwordMatch) {
              // console.log("passwords do not match");
              return done(null, false, { message: "passwords do not match" });
            } else {
              console.log("user found & authenticated");
              // note the return needed with passport local - remove this return for passport JWT
              return done(null, user);
            }
          }
        });
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
  console.log(user.id); // gets user id
});

// from the user id, figure out who the user is...
passport.deserializeUser(function(id, done) {
  db.User.findById(id)
    .then(user => done(null, user))
    .catch(done);
});
