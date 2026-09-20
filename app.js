import path from "node:path";
import express from "express";
import { indexRouter } from "./routes/indexRouter.js";
import { signUpRouter } from "./routes/signUpRouter.js";
import passport from "passport";
import "./config/passport.js"
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { prisma } from "./db/prisma.js";

const app = express();

app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(import.meta.dirname, "public")));

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
		store: new PrismaSessionStore(prisma, {
			checkPeriod: 2 * 60 * 1000,
			dbRecordIdIsSessionId: true,
			dbRecordIdFunction: undefined,
		}),
	}),
);

app.use(passport.session());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

app.use("/", indexRouter);
app.use("/sign-up", signUpRouter)

app.listen(process.env.PORT || 8080, () => {
	console.log("Server running");
});
