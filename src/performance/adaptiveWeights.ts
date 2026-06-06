import fs from "fs";
import path from "path";

const RELIABILITY_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"reliability.json",
);

const CONFIDENCE_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"confidenceCalibration.json",
);

const ADAPTIVE_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"adaptiveWeights.json",
);

export function generateAdaptiveWeights() {
	// ======================
	// CHECK FILES
	// ======================

	if (!fs.existsSync(RELIABILITY_PATH)) {
		console.log("No reliability report found.");
		return;
	}

	if (!fs.existsSync(CONFIDENCE_PATH)) {
		console.log("No confidence calibration report found.");
		return;
	}

	// ======================
	// LOAD REPORTS
	// ======================

	const reliabilityRaw = fs.readFileSync(RELIABILITY_PATH, "utf-8");

	const confidenceRaw = fs.readFileSync(CONFIDENCE_PATH, "utf-8");

	const reliabilityReport = JSON.parse(reliabilityRaw);

	const confidenceReport = JSON.parse(confidenceRaw);

	// =====================================================
	// SIGNAL WEIGHTS
	// =====================================================

	const signalWeights: Record<string, number> = {};

	const recommendations: any[] = [];

	for (const signalData of reliabilityReport.bestSignals) {
		const winRate = parseFloat(signalData.winRate);

		let multiplier = 1;

		if (winRate >= 80) {
			multiplier = 1.15;
		} else if (winRate >= 60) {
			multiplier = 1.05;
		} else if (winRate < 50) {
			multiplier = 0.9;

			recommendations.push({
				type: "SIGNAL",

				value: signalData.signal,

				action: "PENALIZE",

				reason: `${winRate}% historical win rate`,
			});
		}

		signalWeights[signalData.signal] = multiplier;
	}

	// =====================================================
	// SYMBOL WEIGHTS
	// =====================================================

	const symbolWeights: Record<string, number> = {};

	for (const symbolData of reliabilityReport.bestSymbols) {
		const winRate = parseFloat(symbolData.winRate);

		let multiplier = 1;

		if (winRate >= 80) {
			multiplier = 1.1;
		} else if (winRate >= 60) {
			multiplier = 1.03;
		} else if (winRate < 50) {
			multiplier = 0.92;

			recommendations.push({
				type: "SYMBOL",

				value: symbolData.symbol,

				action: "PENALIZE",

				reason: `${winRate}% historical win rate`,
			});
		}

		symbolWeights[symbolData.symbol] = multiplier;
	}

	// =====================================================
	// CONFIDENCE WEIGHTS
	// =====================================================

	const confidenceWeights: Record<string, number> = {};

	for (const stat of confidenceReport.confidenceStats) {
		let multiplier = 1;

		if (!stat.reliable) {
			multiplier = 1;

			recommendations.push({
				type: "CONFIDENCE",

				value: stat.confidence,

				action: "WATCH",

				reason: `Only ${stat.completedTrades} completed trades`,
			});
		} else if (stat.winRate >= 90) {
			multiplier = 1.2;

			recommendations.push({
				type: "CONFIDENCE",

				value: stat.confidence,

				action: "BOOST",

				reason: `${stat.winRate}% win rate across ${stat.completedTrades} trades`,
			});
		} else if (stat.winRate >= 70) {
			multiplier = 1.1;
		} else if (stat.winRate < 50) {
			multiplier = 0.5;

			recommendations.push({
				type: "CONFIDENCE",

				value: stat.confidence,

				action: "PENALIZE",

				reason: `${stat.winRate}% win rate across ${stat.completedTrades} trades`,
			});
		}

		confidenceWeights[String(stat.confidence)] = multiplier;
	}

	// =====================================================
	// BUILD CONFIG
	// =====================================================

	const config = {
		timestamp: new Date().toISOString(),

		signalWeights,

		symbolWeights,

		confidenceWeights,

		recommendations,
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

	console.log("\nConfidence Weights:");

	console.table(confidenceWeights);

	console.log("\nRecommendations:");

	console.table(recommendations);

	console.log("\nAdaptive weights saved successfully.");

	return config;
}
