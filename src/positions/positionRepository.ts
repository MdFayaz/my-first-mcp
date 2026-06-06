import fs from "fs";
import path from "path";

import type { Position } from "./position.js";
import { PositionStatus } from "./position.js";

export class PositionRepository {
	private readonly filePath = path.join(
		process.cwd(),
		"data",
		"positions.json",
	);

	getAll(): Position[] {
		if (!fs.existsSync(this.filePath)) {
			return [];
		}

		return JSON.parse(fs.readFileSync(this.filePath, "utf8"));
	}

	findOpenPosition(symbol: string): Position | undefined {
		return this.getAll().find(
			(position) =>
				position.symbol === symbol && position.status === PositionStatus.OPEN,
		);
	}

	save(position: Position): void {
		const positions = this.getAll();

		positions.push(position);

		fs.writeFileSync(this.filePath, JSON.stringify(positions, null, 2));
	}
}
