import { db } from "../database.js";

export class StateRepository {
	getLastProcessedDate(): string | null {
		const row = db
			.prepare(
				`
            SELECT last_processed_date
            FROM processing_state
            WHERE id = 1
        `,
			)
			.get() as {
			last_processed_date: string | null;
		};

		return row?.last_processed_date ?? null;
	}

	setLastProcessedDate(date: string): void {
		db.prepare(
			`
            UPDATE processing_state
            SET last_processed_date = ?
            WHERE id = 1
        `,
		).run(date);
	}
}
