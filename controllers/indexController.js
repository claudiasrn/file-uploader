import { prisma } from "../db/prisma.js";

export async function getIndex(req, res) {
	if (!req.user) {
		return res.render("index", { folders: [] });
	}

	const folders = await prisma.folder.findMany({
		where: { userId: req.user.id },
	});

	res.render("index", { folders });
}