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
	"environmentAnalytics.json",
);

export function generateEnvironmentAnalytics() {
	if (!fs.existsSync(OUTCOMES_PATH)) {
		console.log("No outcomes found.");
		return;
	}

	const outcomes = JSON.parse(fs.readFileSync(OUTCOMES_PATH, "utf-8"));

	const analytics: Record<string, any> = {};

	for (const trade of outcomes) {
		if (!trade.environment || trade.environment === "UNKNOWN") {
			continue;
		}
		const env = trade.environment ?? "UNKNOWN";

		if (!analytics[env]) {
			analytics[env] = {
				environment: env,
				totalTrades: 0,
				wins: 0,
				losses: 0,
				open: 0,
				winRate: 0,
				averagePnL: 0,
				totalPnL: 0,
			};
		}

		analytics[env].totalTrades++;

		if (trade.status === "WIN") analytics[env].wins++;

		if (trade.status === "LOSS") analytics[env].losses++;

		if (trade.status === "OPEN") analytics[env].open++;

		analytics[env].totalPnL += trade.pnlPercent ?? 0;
	}

	for (const env of Object.keys(analytics)) {
		const row = analytics[env];

		const completed = row.wins + row.losses;

		row.winRate =
			completed > 0 ? Number(((row.wins / completed) * 100).toFixed(2)) : 0;

		row.averagePnL =
			row.totalTrades > 0
				? Number((row.totalPnL / row.totalTrades).toFixed(2))
				: 0;
	}
	console.table(Object.values(analytics));

	fs.writeFileSync(
		OUTPUT_PATH,
		JSON.stringify(Object.values(analytics), null, 2),
	);

	console.log(
		`Environment analytics generated: ${Object.keys(analytics).length}`,
	);
}
