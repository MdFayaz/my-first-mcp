import fs from "fs";
import path from "path";

import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

interface YahooQuote {
	regularMarketPrice?: number;
}

interface SignalOutcome {
	timestamp: string;

	symbol: string;

	signal: string;

	entryPrice: number;

	currentPrice: number;

	pnlPercent: number;

	status: "WIN" | "LOSS" | "OPEN";

	score: number;

	confidence: number;

	qualified: string;

	// ======================
	// REGIME
	// ======================

	regime?: string;

	regimeConfidence?: number;

	higherTimeframeRegime?: string;

	executionRegime?: string;

	// ======================
	// VOLATILITY
	// ======================

	volatilityRegime?: string;

	volatilityConfidence?: number;

	volatilityATRRatio?: number;

	executionVolatilityRegime?: string;

	executionVolatilityConfidence?: number;

	// ======================
	// ENVIRONMENT
	// ======================

	environment?: string;

	environmentReason?: string;

	environmentScoreMultiplier?: number;

	environmentConfidenceMultiplier?: number;

	evaluatedAt: string;
}

const SIGNALS_PATH = path.join(process.cwd(), "signalHistory", "signals.json");

const OUTCOMES_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"outcomes.json",
);

export async function trackSignalOutcomes() {
	// ======================
	// CHECK SIGNAL FILE
	// ======================

	if (!fs.existsSync(SIGNALS_PATH)) {
		console.log("No signals found.");

		return;
	}

	// ======================
	// LOAD SIGNALS
	// ======================

	const raw = fs.readFileSync(SIGNALS_PATH, "utf-8");

	const signals = JSON.parse(raw);

	const outcomes: SignalOutcome[] = [];

	// ======================
	// PROCESS SIGNALS
	// ======================

	for (const signal of signals) {
		try {
			// ======================
			// VALIDATE ENTRY PRICE
			// ======================

			if (!signal.entryPrice) {
				console.log(`Missing entryPrice for ${signal.symbol}`);

				continue;
			}

			// ======================
			// FETCH CURRENT PRICE
			// ======================

			let currentPrice = signal.entryPrice;

			try {
				const quote = (await yahooFinance.quote(signal.symbol)) as YahooQuote;

				currentPrice = quote.regularMarketPrice || signal.entryPrice;
			} catch (err) {
				console.log(`Using fallback price for ${signal.symbol}`);
			}

			// ======================
			// CALCULATE PNL
			// ======================

			let pnlPercent = 0;

			if (signal.signal.includes("BUY")) {
				pnlPercent =
					((currentPrice - signal.entryPrice) / signal.entryPrice) * 100;
			} else if (signal.signal.includes("SELL")) {
				pnlPercent =
					((signal.entryPrice - currentPrice) / signal.entryPrice) * 100;
			}

			// ======================
			// DETERMINE STATUS
			// ======================

			let status: "WIN" | "LOSS" | "OPEN" = "OPEN";

			if (pnlPercent > 0.5) {
				status = "WIN";
			} else if (pnlPercent < -0.5) {
				status = "LOSS";
			}

			// ======================
			// STORE OUTCOME
			// ======================

			outcomes.push({
				timestamp: signal.timestamp,

				symbol: signal.symbol,

				signal: signal.signal,

				entryPrice: signal.entryPrice,

				currentPrice,

				pnlPercent: Number(pnlPercent.toFixed(2)),

				status,

				score: signal.score,

				confidence: signal.confidence,

				qualified: signal.qualified,

				// ======================
				// REGIME
				// ======================

				regime: signal.regime,

				regimeConfidence: signal.regimeConfidence,

				higherTimeframeRegime: signal.higherTimeframeRegime,

				executionRegime: signal.executionRegime,

				// ======================
				// VOLATILITY
				// ======================

				volatilityRegime: signal.volatilityRegime,

				volatilityConfidence: signal.volatilityConfidence,

				volatilityATRRatio: signal.volatilityATRRatio,

				executionVolatilityRegime: signal.executionVolatilityRegime,

				executionVolatilityConfidence: signal.executionVolatilityConfidence,

				// ======================
				// ENVIRONMENT
				// ======================

				environment: signal.environment,

				environmentReason: signal.environmentReason,

				environmentScoreMultiplier: signal.environmentScoreMultiplier,

				environmentConfidenceMultiplier: signal.environmentConfidenceMultiplier,

				evaluatedAt: new Date().toISOString(),
			});
		} catch (err) {
			console.error(`Outcome tracking failed for ${signal.symbol}`, err);
		}
	}

	// ======================
	// SAVE OUTCOMES
	// ======================

	fs.writeFileSync(OUTCOMES_PATH, JSON.stringify(outcomes, null, 2));

	console.log(`Tracked ${outcomes.length} signal outcomes.`);
}
