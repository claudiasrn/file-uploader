import { prisma } from "../db/prisma.js";
import fs from "node:fs/promises";

export async function getFile(req, res) {
	const id = Number(req.params.id);

	const file = await prisma.file.findFirst({
		where: { id, userId: req.user.id },
		include: { folder: true },
	});

	if (!file) {
		return res.status(404).render("404");
	}

	res.render("file", { file });
}

export async function downloadFile(req, res) {
	const id = Number(req.params.id);

	const file = await prisma.file.findFirst({
		where: { id, userId: req.user.id },
	});

	if (!file) {
		return res.status(404).render("404");
	}

	res.download(file.storageKey, file.name);
}

export async function deleteFile(req, res, next) {
	const id = Number(req.params.id);

	const file = await prisma.file.findFirst({
		where: { id, userId: req.user.id },
	});

	if (!file) {
		return res.status(404).render("404");
	}

	await prisma.file.delete({ where: { id } });

	try {
		await fs.unlink(file.storageKey);
	} catch (err) {
		if (err.code !== "ENOENT") return next(err);
	}

	res.redirect(`/folders/${file.folderId}`);
}