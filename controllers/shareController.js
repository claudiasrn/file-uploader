export async function getShare(req, res) {
	const share = await prisma.share.findUnique({
		where: { token: req.params.token },
		include: { folder: { include: { files: true } } },
	});

	if (!share || share.expiresAt < new Date()) {
		return res.status(404).render("404");
	}

	res.render("share", { share });
}

export async function downloadSharedFile(req, res, next) {
	const share = await prisma.share.findUnique({
		where: { token: req.params.token },
	});

	if (!share || share.expiresAt < new Date()) {
		return res.status(404).render("404");
	}

	const file = await prisma.file.findFirst({
		where: { id: Number(req.params.id), folderId: share.folderId },
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
