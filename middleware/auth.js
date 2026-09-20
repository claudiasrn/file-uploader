export function isAuth(req, res, next) {
	if (!req.isAuthenticated()) return res.redirect("/log-in");
	next();
}