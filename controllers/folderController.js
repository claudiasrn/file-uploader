import { prisma } from "../db/prisma.js";
import { body, validationResult } from "express-validator";
import { supabase } from "../db/supabase.js";

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

export async function getFolder(req, res) {
	const id = Number(req.params.id);

	const folder = await prisma.folder.findFirst({
		where: { id, userId: req.user.id },
		include: { files: true },
	});

	if (!folder) {
		return res.status(404).render("404");
	}

	res.render("folder", { folder });
}

export async function getEditFolderForm(req, res) {
	const id = Number(req.params.id);

	const folder = await prisma.folder.findFirst({
		where: { id, userId: req.user.id },
	});

	if (!folder) {
		return res.status(404).render("404");
	}

	res.render("folder-edit", { folder });
}

export async function updateFolder(req, res, next) {
	const id = Number(req.params.id);
	const errors = validationResult(req);
	const { name } = req.body;

	if (!errors.isEmpty()) {
		return res.status(400).render("folder-edit", {
			folder: { id, name },
			errors: errors.array(),
		});
	}

	try {
		const result = await prisma.folder.updateMany({
			where: { id, userId: req.user.id },
			data: { name },
		});

		if (result.count === 0) {
			return res.status(404).render("404");
		}
	} catch (err) {
		if (err.code === "P2002") {
			return res.status(400).render("folder-edit", {
				folder: { id, name },
				errors: [{ msg: "You already have a folder with this name" }],
			});
		}
		return next(err);
	}

	res.redirect(`/folders/${id}`);
}

export async function deleteFolder(req, res, next) {
	const id = Number(req.params.id);

	const folder = await prisma.folder.findFirst({
		where: { id, userId: req.user.id },
		include: { files: true },
	});

	if (!folder) {
		return res.status(404).render("404");
	}

	if (folder.files.length > 0) {
		const { error } = await supabase.storage
			.from("uploads")
			.remove(folder.files.map((file) => file.storageKey));

		if (error) return next(error);
	}

	await prisma.folder.delete({ where: { id } });

	res.redirect("/");
}

export async function uploadFile(req, res, next) {
	const folderId = Number(req.params.id);

	const folder = await prisma.folder.findFirst({
		where: { id: folderId, userId: req.user.id },
	});

	if (!folder) {
		return res.status(404).render("404");
	}

	const key = `${req.user.id}/${crypto.randomUUID()}`;

	const { error } = await supabase.storage
		.from("uploads")
		.upload(key, req.file.buffer, { contentType: req.file.mimetype });

	if (error) return next(error);

	await prisma.file.create({
		data: {
			name: req.file.originalname,
			size: req.file.size,
			mimetype: req.file.mimetype,
			storageKey: key,
			folderId,
			userId: req.user.id,
		},
	});

	res.redirect(`/folders/${folderId}`);
}