import fs from "fs";
import path from "path";

const EXIT_SUMMARY_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"exitAnalyticsSummary.json",
);

const OUTPUT_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"riskRewardOptimization.json",
);

export function generateRiskRewardOptimization() {
	// ======================
	// CHECK FILE
	// ======================

	if (!fs.existsSync(EXIT_SUMMARY_PATH)) {
		console.log("No exit analytics summary found.");

		return;
	}

	// ======================
	// LOAD DATA
	// ======================

	const raw = fs.readFileSync(EXIT_SUMMARY_PATH, "utf-8");

	const exitSummary = JSON.parse(raw);

	// ======================
	// CORE METRICS
	// ======================

	const averageMFE = Number(exitSummary.averageMFE ?? 0);

	const averageMAE = Math.abs(Number(exitSummary.averageMAE ?? 0));

	// ======================
	// OPTIMIZATION LOGIC
	// ======================

	const recommendedStopLoss = Number((averageMAE * 1.25).toFixed(2));

	const conservativeTarget = Number((averageMFE * 0.8).toFixed(2));

	const aggressiveTarget = Number(averageMFE.toFixed(2));

	const riskRewardRatioConservative = Number(
		(conservativeTarget / recommendedStopLoss).toFixed(2),
	);

	const riskRewardRatioAggressive = Number(
		(aggressiveTarget / recommendedStopLoss).toFixed(2),
	);

	// ======================
	// REPORT
	// ======================

	const report = {
		generatedAt: new Date().toISOString(),

		sampleSize: exitSummary.sampleSize,

		recommendedStopLoss,

		conservativeTarget,

		aggressiveTarget,

		riskRewardRatioConservative,

		riskRewardRatioAggressive,
	};

	fs.writeFileSync(OUTPUT_PATH, JSON.stringify(report, null, 2));

	console.log("\n===== RISK REWARD OPTIMIZATION =====");

	console.table(report);

	return report;
}
