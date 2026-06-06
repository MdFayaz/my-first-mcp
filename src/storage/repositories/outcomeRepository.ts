import { db } from "../database.js";

export interface OutcomeRecord {
	signalId: number;

	result: string;

	returnPct: number;

	holdingDays: number;

	maxDrawdown: number;
}

export class OutcomeRepository {
	upsertOutcome(outcome: OutcomeRecord): void {
		db.prepare(
			`
            INSERT INTO outcomes (

                signal_id,

                result,

                return_pct,

                holding_days,

                max_drawdown

            )
            VALUES (

                @signalId,

                @result,

                @returnPct,

                @holdingDays,

                @maxDrawdown
            )

            ON CONFLICT(signal_id)

            DO UPDATE SET

                result = excluded.result,

                return_pct = excluded.return_pct,

                holding_days = excluded.holding_days,

                max_drawdown = excluded.max_drawdown
        `,
		).run(outcome);
	}

	getOutcome(signalId: number): OutcomeRecord | null {
		const row = db
			.prepare(
				`
            SELECT *
            FROM outcomes
            WHERE signal_id = ?
        `,
			)
			.get(signalId) as any;

		if (!row) {
			return null;
		}

		return {
			signalId: row.signal_id,
			result: row.result,
			returnPct: row.return_pct,
			holdingDays: row.holding_days,
			maxDrawdown: row.max_drawdown,
		};
	}

	getAllOutcomes(): OutcomeRecord[] {
		const rows = db
			.prepare(
				`
            SELECT *
            FROM outcomes
        `,
			)
			.all() as any[];

		return rows.map((row) => ({
			signalId: row.signal_id,
			result: row.result,
			returnPct: row.return_pct,
			holdingDays: row.holding_days,
			maxDrawdown: row.max_drawdown,
		}));
	}
}
