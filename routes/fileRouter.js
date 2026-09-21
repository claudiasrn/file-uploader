import { Router } from "express";
import { isAuth } from "../middleware/auth.js";
import { getFile, downloadFile, deleteFile } from "../controllers/fileController.js";

export const fileRouter = Router();

fileRouter.use(isAuth);

fileRouter.get("/:id", getFile);
fileRouter.get("/:id/download", downloadFile);
fileRouter.post("/:id/delete", deleteFile);