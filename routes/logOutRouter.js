import { Router } from "express";
import { logOut } from "../controllers/logOutController.js";

export const logOutRouter = Router();

logOutRouter.post("/", logOut);