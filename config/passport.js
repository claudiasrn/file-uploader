import { prisma } from "../db/prisma.js";
import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";
import passport from "passport";

const strategy = new LocalStrategy(async (username, password, done) => {
	try {
		const user = await prisma.user.findUnique({ where: { username } });

		if (!user) {
			return done(null, false, { message: "Incorrect password or username" });
		}

		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return done(null, false, { message: "Incorrect password or username" });
		}

		return done(null, user);
	} catch (err) {
		return done(err);
	}
});

passport.use(strategy);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await prisma.user.findUnique({ where: { id } });
		done(null, user);
	} catch (err) {
		done(err);
	}
});
