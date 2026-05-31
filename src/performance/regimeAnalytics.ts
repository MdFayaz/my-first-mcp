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
	"regimeAnalytics.json",
);

export function generateRegimeAnalytics() {
	if (!fs.existsSync(OUTCOMES_PATH)) {
		console.log("No outcomes found.");
		return;
	}

	const outcomes = JSON.parse(fs.readFileSync(OUTCOMES_PATH, "utf-8"));

	const analytics: Record<string, any> = {};

	for (const trade of outcomes) {
		if (!trade.regime || trade.regime === "UNKNOWN") {
			continue;
		}

		const regime = trade.regime;

		if (!analytics[regime]) {
			analytics[regime] = {
				regime,
				totalTrades: 0,
				wins: 0,
				losses: 0,
				open: 0,
				winRate: 0,
				averagePnL: 0,
				totalPnL: 0,
			};
		}

		analytics[regime].totalTrades++;

		if (trade.status === "WIN") analytics[regime].wins++;

		if (trade.status === "LOSS") analytics[regime].losses++;

		if (trade.status === "OPEN") analytics[regime].open++;

		analytics[regime].totalPnL += trade.pnlPercent ?? 0;
	}

	for (const regime of Object.keys(analytics)) {
		const row = analytics[regime];

		const completed = row.wins + row.losses;

		row.winRate =
			completed > 0 ? Number(((row.wins / completed) * 100).toFixed(2)) : 0;

		row.averagePnL =
			row.totalTrades > 0
				? Number((row.totalPnL / row.totalTrades).toFixed(2))
				: 0;
	}

	fs.writeFileSync(
		OUTPUT_PATH,
		JSON.stringify(Object.values(analytics), null, 2),
	);

	console.log(`Regime analytics generated: ${Object.keys(analytics).length}`);
}
