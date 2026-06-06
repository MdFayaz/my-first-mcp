import { db } from "../database.js";

export interface AlertHistoryRecord {
	id?: number;

	symbol: string;
	signalType: string;

	confidence: number;
	qualified: boolean;

	alertDate: string;
}

export class AlertHistoryRepository {
	private db = db;

	async create(record: AlertHistoryRecord): Promise<void> {
		const sql = `
            INSERT INTO alert_history (
                symbol,
                signal_type,
                confidence,
                qualified,
                alert_date
            )
            VALUES (?, ?, ?, ?, ?)
        `;

		this.db
			.prepare(sql)
			.run(
				record.symbol,
				record.signalType,
				record.confidence,
				record.qualified ? 1 : 0,
				record.alertDate,
			);
	}

	async findToday(
		symbol: string,
		signalType: string,
		alertDate: string,
	): Promise<AlertHistoryRecord | null> {
		const sql = `
            SELECT *
            FROM alert_history
            WHERE symbol = ?
            AND signal_type = ?
            AND alert_date = ?
            LIMIT 1
        `;

		const row = this.db.prepare(sql).get(symbol, signalType, alertDate) as any;

		if (!row) {
			return null;
		}

		return {
			id: row.id,
			symbol: row.symbol,
			signalType: row.signal_type,
			confidence: row.confidence,
			qualified: Boolean(row.qualified),
			alertDate: row.alert_date,
		};
	}

	async findLatestToday(
		symbol: string,
		alertDate: string,
	): Promise<AlertHistoryRecord | null> {
		const sql = `
        SELECT *
        FROM alert_history
        WHERE symbol = ?
        AND alert_date = ?
        ORDER BY id DESC
        LIMIT 1
    `;

		const row = this.db.prepare(sql).get(symbol, alertDate) as any;

		if (!row) {
			return null;
		}

		return {
			id: row.id,
			symbol: row.symbol,
			signalType: row.signal_type,
			confidence: row.confidence,
			qualified: Boolean(row.qualified),
			alertDate: row.alert_date,
		};
	}
}
