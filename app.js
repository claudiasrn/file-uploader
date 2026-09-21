import path from "node:path";
import express from "express";
import { indexRouter } from "./routes/indexRouter.js";
import { signUpRouter } from "./routes/signUpRouter.js";
import passport from "passport";
import "./config/passport.js";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { prisma } from "./db/prisma.js";
import { logInRouter } from "./routes/logInRouter.js";
import { logOutRouter } from "./routes/logOutRouter.js";
import { folderRouter } from "./routes/folderRouter.js";
import { fileRouter } from "./routes/fileRouter.js";
import { formatSize } from "./lib/format.js";
import { MAX_FILE_SIZE } from "./config/multer.js";
import { shareRouter } from "./routes/shareRouter.js";

const app = express();

app.locals.formatSize = formatSize;
app.locals.maxFileSize = MAX_FILE_SIZE;

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
app.use("/sign-up", signUpRouter);
app.use("/log-in", logInRouter);
app.use("/log-out", logOutRouter);
app.use("/folders", folderRouter);
app.use("/files", fileRouter);
app.use("/share", shareRouter);

app.use((req, res) => {
	res.status(404).render("404");
});

app.use((err, req, res, next) => {
	if (err.code === "LIMIT_FILE_SIZE") {
		return res.status(400).render("error", {
			message: `File is too large. Maximum size is ${formatSize(MAX_FILE_SIZE)}.`,
		});
	}

	console.error(err);
	res.status(500).render("error", { message: "Something went wrong." });
});

app.listen(process.env.PORT || 8080, () => {
	console.log("Server running");
});
