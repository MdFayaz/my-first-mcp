import { db } from "../database.js";
import type { OutcomeRecord } from "../../types/outcomeRecord.js";

export class SignalOutcomeRepository {
	upsert(outcome: OutcomeRecord): void {
		db.prepare(
			`
            INSERT INTO signal_outcomes (

                signal_id,

                symbol,

                signal_date,

                signal,

                confidence,

                qualified,

                regime,

                environment,

                volatility_regime,

                status,

                pnl_percent,

                holding_days,

                max_drawdown,

                evaluated_at

            )
            VALUES (

                @signalId,

                @symbol,

                @signalDate,

                @signal,

                @confidence,

                @qualified,

                @regime,

                @environment,

                @volatilityRegime,

                @status,

                @pnlPercent,

                @holdingDays,

                @maxDrawdown,

                @evaluatedAt
            )

            ON CONFLICT(signal_id)

            DO UPDATE SET

                status = excluded.status,

                pnl_percent = excluded.pnl_percent,

                holding_days = excluded.holding_days,

                max_drawdown = excluded.max_drawdown,

                evaluated_at = excluded.evaluated_at
        `,
		).run({
			...outcome,

			qualified: outcome.qualified ?? null,

			regime: outcome.regime ?? null,

			environment: outcome.environment ?? null,

			volatilityRegime: outcome.volatilityRegime ?? null,

			maxDrawdown: outcome.maxDrawdown ?? null,
		});
	}

	getAll(): OutcomeRecord[] {
		const rows = db
			.prepare(
				`
            SELECT *
            FROM signal_outcomes
        `,
			)
			.all() as any[];

		return rows.map((row) => ({
			signalId: row.signal_id,

			symbol: row.symbol,

			signalDate: row.signal_date,

			signal: row.signal,

			confidence: row.confidence,

			qualified: row.qualified,

			regime: row.regime,

			environment: row.environment,

			volatilityRegime: row.volatility_regime,

			status: row.status,

			pnlPercent: row.pnl_percent,

			holdingDays: row.holding_days,

			maxDrawdown: row.max_drawdown,

			evaluatedAt: row.evaluated_at,
		}));
	}
}
