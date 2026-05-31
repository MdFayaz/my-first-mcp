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
	"volatilityAnalytics.json",
);

export function generateVolatilityAnalytics() {
	if (!fs.existsSync(OUTCOMES_PATH)) {
		console.log("No outcomes found.");
		return;
	}

	const outcomes = JSON.parse(fs.readFileSync(OUTCOMES_PATH, "utf-8"));

	const analytics: Record<string, any> = {};

	for (const trade of outcomes) {
		if (!trade.volatilityRegime || trade.volatilityRegime === "UNKNOWN") {
			continue;
		}

		const volatility = trade.volatilityRegime;

		if (!analytics[volatility]) {
			analytics[volatility] = {
				volatilityRegime: volatility,

				totalTrades: 0,

				wins: 0,

				losses: 0,

				open: 0,

				winRate: 0,

				averagePnL: 0,

				totalPnL: 0,
			};
		}

		analytics[volatility].totalTrades++;

		if (trade.status === "WIN") analytics[volatility].wins++;

		if (trade.status === "LOSS") analytics[volatility].losses++;

		if (trade.status === "OPEN") analytics[volatility].open++;

		analytics[volatility].totalPnL += trade.pnlPercent ?? 0;
	}

	for (const key of Object.keys(analytics)) {
		const row = analytics[key];

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

	console.log(
		`Volatility analytics generated: ${Object.keys(analytics).length}`,
	);
}
