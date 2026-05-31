import fs from "fs";
import path from "path";

const FILE_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"environmentPerformance.json",
);

export interface EnvironmentStats {
	totalSignals: number;
	wins: number;
	losses: number;
	winRate: number;
}

export function loadEnvironmentPerformance(): Record<string, EnvironmentStats> {
	try {
		if (!fs.existsSync(FILE_PATH)) {
			return {};
		}

		return JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
	} catch {
		return {};
	}
}

export function saveEnvironmentPerformance(
	data: Record<string, EnvironmentStats>,
) {
	fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
}
