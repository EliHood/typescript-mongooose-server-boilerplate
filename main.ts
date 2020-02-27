import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { NextFunction, Request, Response } from "express";
import http from "http";
import logger from "morgan";
import apiRouter from "./routers";
import mongoose from "mongoose";
import passport from "passport";
import { useSession } from "./middlewares";
import "./config/passport";
dotenv.config();
const PORT = process.env.PORT || 5000;
const app: express.Application = express();
const httpServer = http.createServer(app);

mongoose.set("useCreateIndex", true);
mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true, keepAlive: true },
  (err: any, client: any) => {
    if (err) {
      throw new Error(err);
    } else {
      console.log("Connected successfully to server");
    }
  }
);

if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
  // to simulate latency of 50ms - 1000ms
  // app.use(simulateLatency(50, 1000));
}

app.set("port", PORT);
app.use(cookieParser());
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
app.use(useSession());
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: process.env.ALLOW_ORIGIN,
    preflightContinue: false,
    credentials: true,
    allowedHeaders: "X-Requested-With, Content-Type, Authorization",
    methods: "GET, POST, PATCH, PUT, POST, DELETE, OPTIONS",
    exposedHeaders: ["Content-Length", "X-Foo", "X-Bar"]
  })
);

app.use("/api/v1", apiRouter);
app.get("/", (req, res) => {
  res.send("Hello World!");
});
httpServer.listen(PORT, () => {
  console.log(
    "App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
  console.log("  Press CTRL-C to stop\n");
});

export default app;
