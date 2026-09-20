import { prisma } from "../db/prisma.js";
import { body, validationResult } from "express-validator";

export function getNewFolderForm(req, res) {
	res.render("folder-form");
}

export const validateFolder = [
	body("name")
		.trim()
		.notEmpty()
		.withMessage("Folder name is required")
		.isLength({ max: 255 })
		.withMessage("Folder name is too long"),
];

export async function postFolder(req, res, next) {
	const errors = validationResult(req);
	const { name } = req.body;

	if (!errors.isEmpty()) {
		return res.status(400).render("folder-form", {
			folder: { name },
			errors: errors.array(),
		});
	}

	try {
		await prisma.folder.create({
			data: { name, userId: req.user.id },
		});
	} catch (err) {
		if (err.code === "P2002") {
			return res.status(400).render("folder-form", {
				folder: { name },
				errors: [{ msg: "You already have a folder with this name" }],
			});
		}
		return next(err);
	}

	res.redirect("/");
}
