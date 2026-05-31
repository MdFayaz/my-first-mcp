import fs from "fs";

import path from "path";

const RELIABILITY_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"reliability.json",
);

const ADAPTIVE_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"adaptiveWeights.json",
);

export function generateAdaptiveWeights() {
	// ======================
	// CHECK FILE
	// ======================

	if (!fs.existsSync(RELIABILITY_PATH)) {
		console.log("No reliability report found.");

		return;
	}

	// ======================
	// LOAD REPORT
	// ======================

	const raw = fs.readFileSync(RELIABILITY_PATH, "utf-8");

	const report = JSON.parse(raw);

	// =====================================================
	// SIGNAL WEIGHTS
	// =====================================================

	const signalWeights: Record<string, number> = {};

	for (const signalData of report.bestSignals) {
		const winRate = parseFloat(signalData.winRate);

		let multiplier = 1;

		// ======================
		// BOOST STRONG SIGNALS
		// ======================

		if (winRate >= 80) {
			multiplier = 1.15;
		}

		// ======================
		// GOOD SIGNALS
		// ======================
		else if (winRate >= 60) {
			multiplier = 1.05;
		}

		// ======================
		// WEAK SIGNALS
		// ======================
		else if (winRate < 50) {
			multiplier = 0.9;
		}

		signalWeights[signalData.signal] = multiplier;
	}

	// =====================================================
	// SYMBOL WEIGHTS
	// =====================================================

	const symbolWeights: Record<string, number> = {};

	for (const symbolData of report.bestSymbols) {
		const winRate = parseFloat(symbolData.winRate);

		let multiplier = 1;

		if (winRate >= 80) {
			multiplier = 1.1;
		} else if (winRate >= 60) {
			multiplier = 1.03;
		} else if (winRate < 50) {
			multiplier = 0.92;
		}

		symbolWeights[symbolData.symbol] = multiplier;
	}

	// =====================================================
	// BUILD CONFIG
	// =====================================================

	const config = {
		timestamp: new Date().toISOString(),

		signalWeights,

		symbolWeights,
	};

	// =====================================================
	// SAVE CONFIG
	// =====================================================

	fs.writeFileSync(ADAPTIVE_PATH, JSON.stringify(config, null, 2));

	// =====================================================
	// OUTPUT
	// =====================================================

	console.log("\n===== ADAPTIVE WEIGHTS =====");

	console.log("\nSignal Weights:");

	console.table(signalWeights);

	console.log("\nSymbol Weights:");

	console.table(symbolWeights);

	console.log("\nAdaptive weights saved successfully.");

	return config;
}
