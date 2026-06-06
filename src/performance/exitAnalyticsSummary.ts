import fs from "fs";
import path from "path";

const INPUT_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"exitAnalytics.json",
);

const OUTPUT_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"exitAnalyticsSummary.json",
);

export function generateExitAnalyticsSummary() {
	if (!fs.existsSync(INPUT_PATH)) {
		console.log("No exit analytics found.");
		return;
	}

	const trades = JSON.parse(fs.readFileSync(INPUT_PATH, "utf-8"));

	if (!trades.length) {
		console.log("No exit analytics records.");
		return;
	}

	const sampleSize = trades.length;

	const averageMFE =
		trades.reduce((sum: number, t: any) => sum + (t.mfePercent ?? 0), 0) /
		sampleSize;

	const averageMAE =
		trades.reduce((sum: number, t: any) => sum + (t.maePercent ?? 0), 0) /
		sampleSize;

	const bestMFE = Math.max(...trades.map((t: any) => t.mfePercent ?? 0));

	const worstMAE = Math.min(...trades.map((t: any) => t.maePercent ?? 0));

	const summary = {
		sampleSize,

		averageMFE: Number(averageMFE.toFixed(2)),

		averageMAE: Number(averageMAE.toFixed(2)),

		bestMFE: Number(bestMFE.toFixed(2)),

		worstMAE: Number(worstMAE.toFixed(2)),
	};

	fs.writeFileSync(OUTPUT_PATH, JSON.stringify(summary, null, 2));

	console.log("Exit analytics summary generated.");
}
