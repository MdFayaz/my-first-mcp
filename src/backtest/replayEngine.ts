import { analyzeMarket } from "../services/marketAnalyzer.js";

import { calculateRSI } from "../core/indicators/rsi.js";

import { calculateEMA } from "../core/indicators/ema.js";

import { calculateATR } from "../core/indicators/atr.js";

import { calculateMACD } from "../core/indicators/macd.js";

import type { Candle } from "../core/indicators/types.js";
import { Logger } from "../utils/logger.js";

import { aggregateCandles } from "./timeframeAggregator.js";
import { buildHTFAnalysis } from "./buildHTFAnalysis.js";

export async function replayMarket(candles: Candle[]) {
	const logger = new Logger();
	logger.info("Replay engine started");
	console.log("TOTAL CANDLES:", candles.length);
	// Minimum candles required
	const warmup = 60;

	for (let i = warmup; i < candles.length; i++) {
		// ======================
		// SIMULATE LIVE FEED
		// ======================

		const historicalCandles = candles.slice(0, i + 1);
		const candles15m = aggregateCandles(historicalCandles, 3);

		const candles1h = aggregateCandles(historicalCandles, 12);
		const latestCandle = historicalCandles[historicalCandles.length - 1]!;

		// ======================
		// INDICATORS
		// ======================

		const closes = historicalCandles.map((c) => c.close);

		const rsi = calculateRSI(closes);

		const ema20 = calculateEMA(closes, 20);

		const ema50 = calculateEMA(closes, 50);

		const highs = historicalCandles.map((c) => c.high);

		const lows = historicalCandles.map((c) => c.low);

		const atr = calculateATR(highs, lows, closes);

		const macd = calculateMACD(closes);

		// ======================
		// ANALYZE MARKET
		// ======================

		const macdResult = calculateMACD(closes);
		console.log({
			rsi,

			ema20,

			ema50,

			atr,

			macdHistogram: Array.isArray(macdResult)
				? (macdResult[macdResult.length - 1]?.histogram ?? 0)
				: (macdResult.histogram ?? 0),
		});
		const timeframeAnalysis = {
			"5m": {
				signal: rsi > 55 ? "BUY" : rsi < 45 ? "SELL" : "NEUTRAL",

				trend: ema20 > ema50 ? "BULLISH" : "BEARISH",
			},

			"15m": buildHTFAnalysis(candles15m),

			"1h": buildHTFAnalysis(candles1h),
		};

		const result = await analyzeMarket(
			"REPLAY",

			historicalCandles,

			latestCandle,

			{
				rsi,

				ema20,

				ema50,

				atr,

				macdHistogram: Array.isArray(macdResult)
					? (macdResult[macdResult.length - 1]?.histogram ?? 0)
					: (macdResult.histogram ?? 0),
			},
		);

		console.log({
			index: i,

			close: latestCandle.close,

			signal: result.signal,

			score: result.confluenceScore,
		});
		// ======================
		// OUTPUT
		// ======================

		// logger.info(
		// 	`[${i}]`,
		// 	latestCandle.close,
		// 	result.signal,
		// 	result.confluenceScore,
		// );
		console.log(
			`[${i}]`,
			`Close=${latestCandle.close}`,
			`Signal=${result.signal}`,
			`Score=${result.confluenceScore}`,
			`Breakout=${result.breakout.breakout}`,
		);
	}
}
