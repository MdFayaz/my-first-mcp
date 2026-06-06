import fs from "fs";
import path from "path";

import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

interface ExitAnalyticsRecord {
	symbol: string;

	entryPrice: number;

	currentPrice: number;

	highestPrice: number;

	lowestPrice: number;

	mfePercent: number;

	maePercent: number;
}

const SIGNALS_PATH = path.join(process.cwd(), "signalHistory", "signals.json");

const OUTPUT_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"exitAnalytics.json",
);

export async function generateExitAnalytics() {
	if (!fs.existsSync(SIGNALS_PATH)) {
		console.log("No signals found.");
		return;
	}

	const signals = JSON.parse(fs.readFileSync(SIGNALS_PATH, "utf-8"));

	console.log(`Generating exit analytics for ${signals.length} signals...`);

	// Yahoo chart logic will go here

	const analytics: ExitAnalyticsRecord[] = [];

	for (const signal of signals) {
		try {
			if (!signal.entryPrice) {
				continue;
			}

			const signalDate = new Date(signal.timestamp);

			if (isNaN(signalDate.getTime())) {
				continue;
			}

			const chart = await yahooFinance.chart(signal.symbol, {
				period1: signalDate,
				interval: "1d",
			});

			const quotes = chart.quotes ?? [];

			if (!quotes.length) {
				continue;
			}

			const highs = quotes
				.map((q: any) => q.high)
				.filter((v: any) => typeof v === "number" && v > 0);

			const lows = quotes
				.map((q: any) => q.low)
				.filter((v: any) => typeof v === "number" && v > 0);

			if (!highs.length || !lows.length) {
				continue;
			}

			const closes = quotes.map((q: any) => q.close ?? 0);

			const highestPrice = Math.max(...highs);

			const lowestPrice = Math.min(...lows);

			if (highestPrice <= 0 || lowestPrice <= 0) {
				continue;
			}
			const currentPrice = closes[closes.length - 1];

			let mfePercent = 0;

			let maePercent = 0;

			if (signal.signal.includes("BUY")) {
				mfePercent = Math.max(
					0,
					((highestPrice - signal.entryPrice) / signal.entryPrice) * 100,
				);

				maePercent = Math.min(
					0,
					((lowestPrice - signal.entryPrice) / signal.entryPrice) * 100,
				);
			} else if (signal.signal.includes("SELL")) {
				mfePercent = Math.max(
					0,
					((signal.entryPrice - lowestPrice) / signal.entryPrice) * 100,
				);
				maePercent = Math.min(
					0,
					((signal.entryPrice - highestPrice) / signal.entryPrice) * 100,
				);
			}

			analytics.push({
				symbol: signal.symbol,

				entryPrice: signal.entryPrice,

				currentPrice,

				highestPrice,

				lowestPrice,

				mfePercent: Number(mfePercent.toFixed(2)),

				maePercent: Number(maePercent.toFixed(2)),
			});
		} catch (err) {
			console.error(`Exit analytics failed for ${signal.symbol}`, err);
		}
	}

	fs.writeFileSync(OUTPUT_PATH, JSON.stringify(analytics, null, 2));

	console.log("Exit analytics generated.");
}
