import { db } from "./storage/database.js";

const rows = db
	.prepare(
		`
    SELECT name
    FROM sqlite_master
    WHERE type='table'
`,
	)
	.all();

console.log(rows);
