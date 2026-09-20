import { Router } from "express";
import { getLogInForm, normalizeUsername } from "../controllers/logInController.js";
import passport from "passport";

export const logInRouter = Router();

logInRouter.get("/", getLogInForm);
logInRouter.post(
	"/",
	normalizeUsername,
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/log-in",
		failureMessage: true,
	}),
);