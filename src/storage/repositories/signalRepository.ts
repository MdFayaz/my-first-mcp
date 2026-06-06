import { db } from "../database.js";
import type { SignalRecord } from "../../types/signalRecord.js";

export class SignalRepository {
	upsert(signal: SignalRecord): void {
		const stmt = db.prepare(`
            INSERT INTO signals (
                symbol,
                signal_date,
                direction,
                score,
                confidence,
                entry_price,
                stop_loss,
                target_price,
                setup_type,
                reasons
            )
            VALUES (
                @symbol,
                @signalDate,
                @direction,
                @score,
                @confidence,
                @entryPrice,
                @stopLoss,
                @targetPrice,
                @setupType,
                @reasons
            )

            ON CONFLICT(
                symbol,
                signal_date
            )

            DO UPDATE SET

                direction = excluded.direction,
                score = excluded.score,
                confidence = excluded.confidence,
                entry_price = excluded.entry_price,
                stop_loss = excluded.stop_loss,
                target_price = excluded.target_price,
                setup_type = excluded.setup_type,
                reasons = excluded.reasons
        `);

		stmt.run({
			symbol: signal.symbol,
			signalDate: signal.signalDate,
			direction: signal.direction,
			score: signal.score,
			confidence: signal.confidence,

			entryPrice: signal.entryPrice ?? null,

			stopLoss: signal.stopLoss ?? null,

			targetPrice: signal.targetPrice ?? null,

			setupType: signal.setupType ?? null,

			reasons: signal.reasons ?? null,
		});
	}
}
