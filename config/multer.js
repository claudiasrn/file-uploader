import multer from "multer";

export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: MAX_FILE_SIZE },
});
