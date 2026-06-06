import { db } from "./storage/database.js";

const rows = db
	.prepare(
		`
        SELECT *
        FROM alert_history
        ORDER BY id DESC
    `,
	)
	.all();

console.table(rows);
