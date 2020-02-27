import * as bcrypt from "bcrypt";
import * as db from "../models";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
export default {
  getAllUsers: async (req: any, res: Response) => {
    try {
      const users = await db.User.find()
        .limit(10)
        .select("-password");
      return res.json(users);
    } catch (err) {
      console.log(err);
    }
  },
  login: async (req: any, res: Response, next: NextFunction) => {
    passport.authenticate("login", (err, user, info) => {
      if (err) {
        console.log(err);
      }
      if (info != undefined) {
        console.log(info.message);
        res.status(401).send({
          message: info.message
        });
      } else {
        req.logIn(user, err => {
          db.User.findOne({
            username: req.body.username
          }).then(user => {
            console.log(user);
            const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
            // res.cookie("jwt", token, { expires: new Date(Date.now() + 10*1000*60*60*24)});
            jwt.verify(token, process.env.SECRET_KEY, function(err, data) {
              console.log(err, data);
            });
            res.status(200).send({
              auth: true,
              token: token,
              message: "user found & logged in"
            });
            // console.log(req.user)
          });
        });
      }
    })(req, res, next);
  },

  register: async (req: any, res: Response, next: NextFunction) => {
    passport.authenticate("register", (err, user, info) => {
      if (err) {
        console.log(err);
      }
      if (info != undefined) {
        res.status(403).send({
          message: info.message
        });
      } else {
        req.logIn(user, err => {
          const data = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
          };
          console.log(data);
          db.User.findOne({
            username: req.body.username
          }).then(() => {
            console.log("test", req.user);
            const token = jwt.sign(
              { id: req.user._id },
              process.env.SECRET_KEY
            );
            // res.cookie("jwt", token, { expires: new Date(Date.now() + 10*1000*60*60*24)});
            // jwt.verify(token, process.env.JWT_SECRET, function(err, data){
            //   console.log(err, data);
            // })

            console.log("user created in db");
            res
              .status(200)
              .send({ message: "user created", token: token, auth: true });
          });
        });
      }
    })(req, res, next);
  }
};
