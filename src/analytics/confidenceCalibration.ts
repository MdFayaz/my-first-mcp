import fs from "fs";
import path from "path";

const OUTCOMES_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"outcomes.json",
);

const OUTPUT_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"confidenceCalibration.json",
);

export function generateConfidenceCalibration() {
	// ======================
	// CHECK FILE
	// ======================

	if (!fs.existsSync(OUTCOMES_PATH)) {
		console.log("No outcomes found.");

		return;
	}

	// ======================
	// LOAD OUTCOMES
	// ======================

	const raw = fs.readFileSync(OUTCOMES_PATH, "utf-8");

	const outcomes = JSON.parse(raw);

	// ======================
	// AGGREGATE BY CONFIDENCE
	// ======================

	const stats: Record<number, any> = {};

	for (const outcome of outcomes) {
		const confidence = Number(outcome.confidence);

		if (!stats[confidence]) {
			stats[confidence] = {
				confidence,

				totalSignals: 0,

				wins: 0,
				losses: 0,
				open: 0,

				totalReturn: 0,
			};
		}

		stats[confidence].totalSignals++;

		if (outcome.status === "WIN") {
			stats[confidence].wins++;
		} else if (outcome.status === "LOSS") {
			stats[confidence].losses++;
		} else {
			stats[confidence].open++;
		}

		stats[confidence].totalReturn += Number(outcome.pnlPercent ?? 0);
	}

	// ======================
	// BUILD REPORT
	// ======================

	const confidenceStats = Object.values(stats)
		.map((s: any) => {
			const completedTrades = s.wins + s.losses;

			const reliable = completedTrades >= 20;

			const winRate =
				completedTrades > 0
					? Number(((s.wins / completedTrades) * 100).toFixed(2))
					: 0;

			const averageReturn = Number((s.totalReturn / s.totalSignals).toFixed(2));

			const expectancy = Number((averageReturn * (winRate / 100)).toFixed(2));

			return {
				confidence: s.confidence,

				totalSignals: s.totalSignals,

				completedTrades,

				wins: s.wins,
				losses: s.losses,
				open: s.open,

				reliable,

				winRate,

				averageReturn,

				expectancy,
			};
		})
		.sort((a: any, b: any) => {
			if (b.completedTrades !== a.completedTrades) {
				return b.completedTrades - a.completedTrades;
			}

			return b.confidence - a.confidence;
		});

	const report = {
		generatedAt: new Date().toISOString(),

		sampleSize: outcomes.length,

		confidenceStats,
	};

	// ======================
	// SAVE REPORT
	// ======================

	fs.writeFileSync(OUTPUT_PATH, JSON.stringify(report, null, 2));

	// ======================
	// TERMINAL OUTPUT
	// ======================

	console.log("\n===== CONFIDENCE CALIBRATION =====");

	console.table(confidenceStats);

	console.log("\nConfidence calibration generated successfully.");

	return report;
}
