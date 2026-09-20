import { Router } from "express";
import { isAuth } from "../middleware/auth.js";
import {
	getNewFolderForm,
	validateFolder,
	postFolder,
} from "../controllers/folderController.js";

export const folderRouter = Router();

folderRouter.use(isAuth);

folderRouter.get("/new", getNewFolderForm);
folderRouter.post("/", validateFolder, postFolder);