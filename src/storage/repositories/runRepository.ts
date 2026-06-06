import { db } from "../database.js";
import { RunStatus } from "../../types/engineRun.js";
import type { EngineRun } from "../../types/engineRun.js";

export class RunRepository {
	createRun(runDate: string): number {
		const stmt = db.prepare(`
            INSERT INTO engine_runs (
                run_date,
                status,
                started_at
            )
            VALUES (
                ?,
                ?,
                ?
            )
        `);

		const result = stmt.run(
			runDate,
			RunStatus.RUNNING,
			new Date().toISOString(),
		);

		return Number(result.lastInsertRowid);
	}

	markSuccess(runId: number): void {
		db.prepare(
			`
            UPDATE engine_runs
            SET
                status = ?,
                completed_at = ?
            WHERE id = ?
        `,
		).run(RunStatus.SUCCESS, new Date().toISOString(), runId);
	}

	markFailed(runId: number, errorMessage: string): void {
		db.prepare(
			`
            UPDATE engine_runs
            SET
                status = ?,
                completed_at = ?,
                error_message = ?
            WHERE id = ?
        `,
		).run(RunStatus.FAILED, new Date().toISOString(), errorMessage, runId);
	}

	getLatestRun(): EngineRun | null {
		const row = db
			.prepare(
				`
            SELECT *
            FROM engine_runs
            ORDER BY id DESC
            LIMIT 1
        `,
			)
			.get() as any;

		if (!row) {
			return null;
		}

		return {
			id: row.id,
			runDate: row.run_date,
			status: row.status,
			startedAt: row.started_at,
			completedAt: row.completed_at,
			errorMessage: row.error_message,
		};
	}
}
