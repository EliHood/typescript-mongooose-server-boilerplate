import * as express from "express";
import userRouter from "./userRouter";
const router: express.Router = express.Router();
router.use("/users", userRouter);
export default router;
