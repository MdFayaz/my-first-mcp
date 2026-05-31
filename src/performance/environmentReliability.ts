import fs from "fs";
import path from "path";

const ENVIRONMENT_PERFORMANCE_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"environmentPerformance.json",
);

export function getEnvironmentMultiplier(environment: string): number {
	try {
		if (!fs.existsSync(ENVIRONMENT_PERFORMANCE_PATH)) {
			return 1;
		}

		const stats = JSON.parse(
			fs.readFileSync(ENVIRONMENT_PERFORMANCE_PATH, "utf-8"),
		);

		const envStats = stats[environment];

		if (!envStats) {
			return 1;
		}

		const totalSignals = envStats.totalSignals ?? 0;

		const winRate = envStats.winRate ?? 0;

		// Avoid learning from tiny samples

		if (totalSignals < 10) {
			return 1;
		}

		// Strong environment

		if (winRate >= 70) {
			return 1.15;
		}

		// Good environment

		if (winRate >= 60) {
			return 1.1;
		}

		// Weak environment

		if (winRate <= 40) {
			return 0.9;
		}

		// Very poor environment

		if (winRate <= 30) {
			return 0.8;
		}

		return 1;
	} catch {
		return 1;
	}
}
