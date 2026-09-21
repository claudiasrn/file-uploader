import { Router } from "express";
import {
	getShare,
	downloadSharedFile,
} from "../controllers/shareController.js";

export const shareRouter = Router();

shareRouter.get("/:token", getShare);
shareRouter.get("/:token/files/:id", downloadSharedFile);
