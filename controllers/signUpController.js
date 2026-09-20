import { body, validationResult } from "express-validator";
import { prisma } from "../db/prisma.js";
import bcrypt from "bcryptjs";

export function getSignUpForm(req, res) {
	res.render("sign-up");
}

export const validateSignUp = [
	body("username")
		.trim()
		.notEmpty()
		.withMessage("Username is required")
		.isLength({ max: 255 })
		.withMessage("Username is too long"),

	body("password")
		.isLength({ min: 8 })
		.withMessage("Password must be at least 8 characters"),

	body("confirm_password")
		.custom((value, { req }) => value === req.body.password)
		.withMessage("Passwords do not match"),
];

export async function postUser(req, res, next) {
	const errors = validationResult(req);
	const { username, password } = req.body;

	if (!errors.isEmpty()) {
		return res.status(400).render("sign-up", {
			user: { username },
			errors: errors.array(),
		});
	}

	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		await prisma.user.create({
			data: { username: username, password: hashedPassword },
		});
	} catch (err) {
		if (err.code === "P2002") {
			return res.status(400).render("sign-up", {
				user: { username },
				errors: [{ msg: "A user with this username already exists" }],
			});
		}
		return next(err);
	}

	res.redirect("/");
}
