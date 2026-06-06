import fs from "fs";
import path from "path";

import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

const SIGNALS_PATH = path.join(process.cwd(), "signalHistory", "signals.json");

const OUTPUT_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"holdingPeriodAnalytics.json",
);

interface SignalHoldingStats {
	total1d: number;
	total3d: number;
	total5d: number;

	count1d: number;
	count3d: number;
	count5d: number;

	win1d: number;
	win3d: number;
	win5d: number;
}

const signalStats = new Map<string, SignalHoldingStats>();

function calculateSignalReturn(
	signalType: string,
	entryPrice: number,
	exitPrice: number,
): number {
	const rawReturn = ((exitPrice - entryPrice) / entryPrice) * 100;

	const isShortSignal = signalType === "SELL" || signalType === "STRONG SELL";

	return isShortSignal ? -rawReturn : rawReturn;
}

export async function generateHoldingPeriodAnalytics() {
	if (!fs.existsSync(SIGNALS_PATH)) {
		console.log("No signals found.");
		return;
	}

	const signals = JSON.parse(fs.readFileSync(SIGNALS_PATH, "utf-8"));

	let total1d = 0;
	let total3d = 0;
	let total5d = 0;

	let count1d = 0;
	let count3d = 0;
	let count5d = 0;

	for (const signal of signals) {
		const signalType = signal.signal ?? "UNKNOWN";
		if (!signalStats.has(signalType)) {
			signalStats.set(signalType, {
				total1d: 0,
				total3d: 0,
				total5d: 0,

				count1d: 0,
				count3d: 0,
				count5d: 0,

				win1d: 0,
				win3d: 0,
				win5d: 0,
			});
		}
		try {
			const signalDate = new Date(signal.timestamp);
			signalDate.setDate(signalDate.getDate() - 1);
			signalDate.setHours(0, 0, 0, 0);

			if (!signal.entryPrice) {
				continue;
			}

			console.log(
				"REQUEST",
				signal.symbol,
				new Date(signal.timestamp).toISOString(),
				new Date().toISOString(),
			);

			const chart = await yahooFinance.chart(signal.symbol, {
				period1: signalDate,
				period2: new Date(),
				interval: "1d",
			});

			if (signal.symbol === "LT.NS") {
				console.log("===== CHART META =====");

				console.log(chart.meta);

				console.log("===== FIRST 5 QUOTES =====");

				console.log(chart.quotes?.slice(0, 5));
			}
			const quotes = chart.quotes ?? [];

			console.log(signal.symbol, "quotes:", quotes.length);

			if (quotes.length > 0) {
				const firstQuote = quotes.at(0);

				const lastQuote = quotes.at(-1);

				console.log(
					signal.symbol,
					"firstDate:",
					firstQuote?.date,
					"lastDate:",
					lastQuote?.date,
					"count:",
					quotes.length,
				);
			}

			if (!quotes.length) {
				continue;
			}

			const closes = quotes
				.map((q: any) => q.close)
				.filter((v: any) => typeof v === "number" && v > 0);

			const tradingDaysAvailable = closes.length;

			console.log(
				signal.symbol,
				"quotes:",
				quotes.length,
				"closes:",
				closes.length,
			);

			if (tradingDaysAvailable >= 1) {
				const pnl = calculateSignalReturn(
					signalType,
					signal.entryPrice,
					closes[0],
				);
				const stats = signalStats.get(signalType)!;

				total1d += pnl;
				count1d++;

				stats.total1d += pnl;
				stats.count1d++;

				if (pnl > 0) {
					stats.win1d++;
				}
			}

			if (tradingDaysAvailable >= 3) {
				const pnl = calculateSignalReturn(
					signalType,
					signal.entryPrice,
					closes[2],
				);

				const stats = signalStats.get(signalType)!;

				total3d += pnl;
				count3d++;

				stats.total3d += pnl;
				stats.count3d++;

				if (pnl > 0) {
					stats.win3d++;
				}
			}

			if (tradingDaysAvailable >= 5) {
				const pnl = calculateSignalReturn(
					signalType,
					signal.entryPrice,
					closes[4],
				);

				const stats = signalStats.get(signalType)!;

				total5d += pnl;
				count5d++;

				stats.total5d += pnl;
				stats.count5d++;

				if (pnl > 0) {
					stats.win5d++;
				}
			}
		} catch (err) {
			console.error(`Holding analytics failed for ${signal.symbol}`, err);
		}
	}

	console.log({
		count1d,
		count3d,
		count5d,
	});

	const signalBreakdown: Record<string, any> = {};
	for (const [signalType, stats] of signalStats) {
		signalBreakdown[signalType] = {
			sampleSize: Math.max(stats.count1d, stats.count3d, stats.count5d),

			avg1d:
				stats.count1d > 0
					? Number((stats.total1d / stats.count1d).toFixed(2))
					: 0,

			avg3d:
				stats.count3d > 0
					? Number((stats.total3d / stats.count3d).toFixed(2))
					: 0,

			avg5d:
				stats.count5d > 0
					? Number((stats.total5d / stats.count5d).toFixed(2))
					: 0,

			winRate1d:
				stats.count1d > 0
					? Number(((stats.win1d / stats.count1d) * 100).toFixed(2))
					: 0,

			winRate3d:
				stats.count3d > 0
					? Number(((stats.win3d / stats.count3d) * 100).toFixed(2))
					: 0,

			winRate5d:
				stats.count5d > 0
					? Number(((stats.win5d / stats.count5d) * 100).toFixed(2))
					: 0,
		};
	}
	const summary = {
		overall: {
			sampleSize: signals.length,

			avg1d: count1d > 0 ? Number((total1d / count1d).toFixed(2)) : 0,

			avg3d: count3d > 0 ? Number((total3d / count3d).toFixed(2)) : 0,

			avg5d: count5d > 0 ? Number((total5d / count5d).toFixed(2)) : 0,
		},

		signals: signalBreakdown,
	};
	fs.writeFileSync(OUTPUT_PATH, JSON.stringify(summary, null, 2));

	console.log("Holding period analytics generated.");
}
