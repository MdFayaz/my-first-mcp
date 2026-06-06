import { db } from "../storage/database.js";

export interface PendingPrediction {
	signalId: number;

	symbol: string;

	signalDate: string;

	direction: string;

	score: number;

	confidence: number;

	entryPrice: number;
}

export class PredictionTracker {
	getPendingPredictions(): PendingPrediction[] {
		const rows = db
			.prepare(
				`
            SELECT
                s.id,
                s.symbol,
                s.signal_date,
                s.direction,
                s.score,
                s.confidence,
                s.entry_price
            FROM signals s
            LEFT JOIN outcomes o
                ON s.id = o.signal_id
            WHERE o.signal_id IS NULL
        `,
			)
			.all() as any[];

		return rows.map((row) => ({
			signalId: row.id,
			symbol: row.symbol,
			signalDate: row.signal_date,
			direction: row.direction,
			score: row.score,
			confidence: row.confidence,
			entryPrice: Number(row.entry_price ?? 0),
		}));
	}
}
