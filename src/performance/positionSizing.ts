import fs from "fs";
import path from "path";

const CONFIDENCE_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"confidenceCalibration.json",
);

const OUTPUT_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"positionSizing.json",
);

export function generatePositionSizing() {
	// ======================
	// CHECK FILE
	// ======================

	if (!fs.existsSync(CONFIDENCE_PATH)) {
		console.log("Confidence calibration file not found.");

		return;
	}

	// ======================
	// LOAD FILE
	// ======================

	const raw = fs.readFileSync(CONFIDENCE_PATH, "utf-8");

	const calibration = JSON.parse(raw);

	// ======================
	// BUILD RULES
	// ======================

	const rules = calibration.confidenceStats.map((stat: any) => {
		let recommendation = "WATCH";

		let positionSizeMultiplier = 0;

		let capitalAllocationPercent = 0;

		let riskPerTradePercent = 0;

		if (!stat.reliable) {
			recommendation = "WATCH";
		} else if (stat.winRate < 50) {
			recommendation = "AVOID";
		} else if (stat.winRate >= 90) {
			if (stat.completedTrades >= 100) {
				recommendation = "AGGRESSIVE";

				positionSizeMultiplier = 1.5;

				capitalAllocationPercent = 15;

				riskPerTradePercent = 1.5;
			} else {
				recommendation = "NORMAL";

				positionSizeMultiplier = 1;

				capitalAllocationPercent = 10;

				riskPerTradePercent = 1;
			}
		} else if (stat.winRate >= 70) {
			recommendation = "NORMAL";

			positionSizeMultiplier = 1;

			capitalAllocationPercent = 10;

			riskPerTradePercent = 1;
		} else {
			recommendation = "SMALL";

			positionSizeMultiplier = 0.5;

			capitalAllocationPercent = 5;

			riskPerTradePercent = 0.5;
		}

		return {
			confidence: stat.confidence,

			winRate: stat.winRate,

			expectancy: stat.expectancy ?? 0,

			completedTrades: stat.completedTrades,

			reliable: stat.reliable,

			positionSizeMultiplier,

			capitalAllocationPercent,

			riskPerTradePercent,

			recommendation,
		};
	});

	// ======================
	// REPORT
	// ======================

	const report = {
		generatedAt: new Date().toISOString(),

		rules,
	};

	// ======================
	// SAVE
	// ======================

	fs.writeFileSync(OUTPUT_PATH, JSON.stringify(report, null, 2));

	// ======================
	// TERMINAL
	// ======================

	console.log("\n===== POSITION SIZING =====");

	console.table(rules);

	console.log("\nPosition sizing generated successfully.");

	return report;
}
