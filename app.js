import path from "node:path";
import express from "express";
import indexRouter from "./routes/indexRouter.js";

const app = express();

app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(import.meta.dirname, "public")));

app.use("/", indexRouter);

app.listen(process.env.PORT || 8080, () => {
	console.log("Server running");
});
