import { db } from "./storage/database.js";

const rows = db
	.prepare(
		`
        SELECT *
        FROM signals
    `,
	)
	.all();

console.log(rows);
