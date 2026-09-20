import { Router } from "express";
import {
	getSignUpForm,
	postUser,
	validateSignUp,
} from "../controllers/signUpController.js";

export const signUpRouter = Router();

signUpRouter.get("/", getSignUpForm);
signUpRouter.post("/", validateSignUp, postUser);
