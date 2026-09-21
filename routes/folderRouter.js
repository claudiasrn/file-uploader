import { Router } from "express";
import { isAuth } from "../middleware/auth.js";
import {
	getNewFolderForm,
	validateFolder,
	postFolder,
	getFolder,
	updateFolder,
	deleteFolder,
	getEditFolderForm,
    uploadFile
} from "../controllers/folderController.js";
import { upload } from "../config/multer.js";

export const folderRouter = Router();

folderRouter.use(isAuth);

folderRouter.get("/new", getNewFolderForm);
folderRouter.post("/", validateFolder, postFolder);
folderRouter.get("/:id", getFolder);
folderRouter.get("/:id/edit", getEditFolderForm);
folderRouter.post("/:id/edit", validateFolder, updateFolder);
folderRouter.post("/:id/delete", deleteFolder);
folderRouter.post("/:id/upload", upload.single("file"), uploadFile);
