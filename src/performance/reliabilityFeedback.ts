import fs from "fs";
import path from "path";

const ENV_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"environmentAnalytics.json",
);

const REGIME_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"regimeAnalytics.json",
);

const VOLATILITY_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"volatilityAnalytics.json",
);

const OUTPUT_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"reliabilityFeedback.json",
);

export function generateReliabilityFeedback() {
	const output: {
		regimeMultipliers: Record<string, number>;
		volatilityMultipliers: Record<string, number>;
		environmentMultipliers: Record<string, number>;
	} = {
		regimeMultipliers: {},
		volatilityMultipliers: {},
		environmentMultipliers: {},
	};

	// ======================
	// REGIME
	// ======================

	if (fs.existsSync(REGIME_PATH)) {
		const regimes = JSON.parse(fs.readFileSync(REGIME_PATH, "utf-8"));

		for (const row of regimes) {
			const completedTrades = (row.wins ?? 0) + (row.losses ?? 0);

			if (completedTrades < 10) {
				continue;
			}
			let multiplier = 1;

			if (row.winRate >= 70) multiplier = 1.15;
			else if (row.winRate >= 55) multiplier = 1.05;
			else if (row.winRate <= 40) multiplier = 0.85;

			output.regimeMultipliers[row.regime] = multiplier;
		}
	}

	// ======================
	// VOLATILITY
	// ======================

	if (fs.existsSync(VOLATILITY_PATH)) {
		const volatility = JSON.parse(fs.readFileSync(VOLATILITY_PATH, "utf-8"));

		for (const row of volatility) {
			const completedTrades = (row.wins ?? 0) + (row.losses ?? 0);

			if (completedTrades < 10) {
				continue;
			}
			let multiplier = 1;

			if (row.winRate >= 70) multiplier = 1.1;
			else if (row.winRate <= 40) multiplier = 0.9;

			output.volatilityMultipliers[row.volatilityRegime] = multiplier;
		}
	}

	// ======================
	// ENVIRONMENT
	// ======================

	if (fs.existsSync(ENV_PATH)) {
		const environments = JSON.parse(fs.readFileSync(ENV_PATH, "utf-8"));

		for (const row of environments) {
			const completedTrades = (row.wins ?? 0) + (row.losses ?? 0);

			if (completedTrades < 10) {
				continue;
			}
			let multiplier = 1;

			if (row.winRate >= 70) multiplier = 1.15;
			else if (row.winRate <= 40) multiplier = 0.85;

			output.environmentMultipliers[row.environment] = multiplier;
		}
	}

	fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));

	console.log("Reliability feedback generated");
}
