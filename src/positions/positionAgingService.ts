import fs from "fs";
import path from "path";
import { PositionRepository } from "./positionRepository.js";
import type { Position } from "./position.js";

export interface PositionAgingRecord {
	symbol: string;
	signal: string;

	daysHeld: number;
	daysRemaining: number;

	recommendedHoldDays: number;

	holdStatus: "ACTIVE" | "REVIEW_DUE";
}

export class PositionAgingService {
	private repository: PositionRepository;

	constructor() {
		this.repository = new PositionRepository();
	}

	generateAgingReport(): PositionAgingRecord[] {
		const positions = this.repository.getAll();

		const openPositions = positions.filter(
			(position) => position.status === "OPEN",
		);

		const report: PositionAgingRecord[] = openPositions.map(
			(position: Position) => {
				const openedDate = new Date(position.openedAt);
				const now = new Date();

				const diffMs = now.getTime() - openedDate.getTime();

				const MS_PER_DAY = 1000 * 60 * 60 * 24;

				const daysHeld = Math.max(0, Math.floor(diffMs / MS_PER_DAY));

				const daysRemaining = Math.max(
					0,
					position.recommendedHoldDays - daysHeld,
				);

				const holdStatus =
					daysHeld >= position.recommendedHoldDays ? "REVIEW_DUE" : "ACTIVE";

				return {
					symbol: position.symbol,
					signal: position.signal,

					daysHeld,
					daysRemaining,

					recommendedHoldDays: position.recommendedHoldDays,

					holdStatus,
				};
			},
		);

		this.saveReport(report);

		return report;
	}

	private saveReport(report: PositionAgingRecord[]): void {
		const outputPath = path.resolve("data", "positionAging.json");

		fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
	}
}
