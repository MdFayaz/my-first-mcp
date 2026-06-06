import { db } from "./storage/database.js";

console.log(
	db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all(),
);
