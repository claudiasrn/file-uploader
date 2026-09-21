import { prisma } from "../db/prisma.js";
import { supabase } from "../db/supabase.js";

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

export async function downloadFile(req, res, next) {
	const id = Number(req.params.id);

	const file = await prisma.file.findFirst({
		where: { id, userId: req.user.id },
	});

	if (!file) {
		return res.status(404).render("404");
	}

	const { data, error } = await supabase.storage
		.from("uploads")
		.createSignedUrl(file.storageKey, 60, { download: file.name });

	if (error) return next(error);

	res.redirect(data.signedUrl);
}

export async function deleteFile(req, res, next) {
	const id = Number(req.params.id);

	const file = await prisma.file.findFirst({
		where: { id, userId: req.user.id },
	});

	if (!file) {
		return res.status(404).render("404");
	}


	const { error } = await supabase.storage
		.from("uploads")
		.remove([file.storageKey]);

	if (error) return next(error);

	await prisma.file.delete({ where: { id } });

	res.redirect(`/folders/${file.folderId}`);
}
