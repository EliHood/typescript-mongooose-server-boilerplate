import dotenv from "dotenv";
import session from "express-session";

export interface sessionInterface {
  secret: string;
  resave: boolean;
  saveUninitialized: boolean;
  cookie: object;
}

const sessionConfig: sessionInterface = {
  secret: "nodeauth",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: false,
    path: "/",
    secure: false,
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  }
};

export default sessionConfig;
