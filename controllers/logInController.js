import { body } from "express-validator";

export function getLogInForm(req, res) {
    const messages = req.session.messages || [];
    req.session.messages = [];
    res.render("log-in", { messages });
}

export const normalizeUsername = [body("username").trim().toLowerCase()];
