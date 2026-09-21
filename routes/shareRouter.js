import { Router } from "express";
import { getShare } from "../controllers/shareController.js";

export const shareRouter = Router();

shareRouter.get("/:token", getShare);
shareRouter.get("/:token/files/:id", downloadSharedFile);