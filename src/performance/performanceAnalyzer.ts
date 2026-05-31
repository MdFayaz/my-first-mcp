import fs from "fs";
import path from "path";

const OUTCOMES_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"outcomes.json",
);

const PERFORMANCE_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"performance.json",
);

const ENVIRONMENT_PERFORMANCE_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"environmentPerformance.json",
);

export function analyzePerformance() {
	// ======================
	// CHECK OUTCOMES FILE
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
	// BASIC COUNTERS
	// ======================

	const totalSignals = outcomes.length;

	const wins = outcomes.filter((o: any) => o.status === "WIN");

	const losses = outcomes.filter((o: any) => o.status === "LOSS");

	const open = outcomes.filter((o: any) => o.status === "OPEN");

	// ======================
	// WIN RATE
	// ======================

	const completedTrades = wins.length + losses.length;

	const winRate =
		completedTrades > 0
			? ((wins.length / completedTrades) * 100).toFixed(2)
			: "0";

	// ======================
	// AVERAGE PNL
	// ======================

	const totalPnL = outcomes.reduce(
		(sum: number, o: any) => sum + o.pnlPercent,
		0,
	);

	const averagePnL =
		totalSignals > 0 ? (totalPnL / totalSignals).toFixed(2) : "0";

	// ======================
	// BUY ACCURACY
	// ======================

	const buySignals = outcomes.filter((o: any) => o.signal.includes("BUY"));

	const buyWins = buySignals.filter((o: any) => o.status === "WIN");

	const buyAccuracy =
		buySignals.length > 0
			? ((buyWins.length / buySignals.length) * 100).toFixed(2)
			: "0";

	// ======================
	// SELL ACCURACY
	// ======================

	const sellSignals = outcomes.filter((o: any) => o.signal.includes("SELL"));

	const sellWins = sellSignals.filter((o: any) => o.status === "WIN");

	const sellAccuracy =
		sellSignals.length > 0
			? ((sellWins.length / sellSignals.length) * 100).toFixed(2)
			: "0";

	// ======================
	// QUALIFIED SIGNALS
	// ======================

	const qualifiedSignals = outcomes.filter((o: any) => o.qualified === "YES");

	const qualifiedWins = qualifiedSignals.filter((o: any) => o.status === "WIN");

	const qualifiedAccuracy =
		qualifiedSignals.length > 0
			? ((qualifiedWins.length / qualifiedSignals.length) * 100).toFixed(2)
			: "0";

	// ======================
	// ENVIRONMENT ANALYTICS
	// ======================

	const environmentStats: Record<string, any> = {};

	for (const outcome of outcomes) {
		const environment = outcome.environment ?? "UNKNOWN";

		if (!environmentStats[environment]) {
			environmentStats[environment] = {
				totalSignals: 0,
				wins: 0,
				losses: 0,
				winRate: 0,
			};
		}

		environmentStats[environment].totalSignals++;

		if (outcome.status === "WIN") {
			environmentStats[environment].wins++;
		}

		if (outcome.status === "LOSS") {
			environmentStats[environment].losses++;
		}
	}

	for (const env of Object.keys(environmentStats)) {
		const stats = environmentStats[env];

		const completed = stats.wins + stats.losses;

		stats.winRate =
			completed > 0 ? Number(((stats.wins / completed) * 100).toFixed(2)) : 0;
	}

	// ======================
	// BUILD SUMMARY
	// ======================

	const summary = {
		timestamp: new Date().toISOString(),

		totalSignals,

		wins: wins.length,

		losses: losses.length,

		open: open.length,

		winRate: `${winRate}%`,

		averagePnL: `${averagePnL}%`,

		buyAccuracy: `${buyAccuracy}%`,

		sellAccuracy: `${sellAccuracy}%`,

		qualifiedAccuracy: `${qualifiedAccuracy}%`,
	};

	// ======================
	// LOAD EXISTING HISTORY
	// ======================

	let existing: any[] = [];

	if (fs.existsSync(PERFORMANCE_PATH)) {
		try {
			const existingRaw = fs.readFileSync(PERFORMANCE_PATH, "utf-8");

			existing = JSON.parse(existingRaw);
		} catch {
			existing = [];
		}
	}

	// ======================
	// APPEND NEW SNAPSHOT
	// ======================

	existing.push(summary);

	// ======================
	// SAVE PERFORMANCE HISTORY
	// ======================

	fs.writeFileSync(PERFORMANCE_PATH, JSON.stringify(existing, null, 2));

	fs.writeFileSync(
		ENVIRONMENT_PERFORMANCE_PATH,
		JSON.stringify(environmentStats, null, 2),
	);

	// ======================
	// TERMINAL OUTPUT
	// ======================

	console.log("\n===== PERFORMANCE ANALYTICS =====");

	console.table(summary);

	console.log("\n===== ENVIRONMENT PERFORMANCE =====");

	console.table(environmentStats);

	console.log("\nPerformance snapshot saved.");

	return summary;
}
