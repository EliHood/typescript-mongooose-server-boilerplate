import * as express from "express";
import { userController } from "../controllers";
const router: express.Router = express.Router();
router.post("/register", userController.register);
router.get("/getUsers", userController.getAllUsers);
router.post("/login", userController.login);
export default router;
