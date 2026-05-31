import { calculateRSI } from "../core/indicators/rsi.js";

import { calculateEMA } from "../core/indicators/ema.js";

import type { Candle } from "../core/indicators/types.js";

export function buildHTFAnalysis(candles: Candle[]) {
	if (candles.length < 50) {
		return {
			signal: "NEUTRAL",

			trend: "NEUTRAL",
		};
	}

	const closes = candles.map((c) => c.close);

	const rsi = calculateRSI(closes);

	const ema20 = calculateEMA(closes, 20);

	const ema50 = calculateEMA(closes, 50);

	let signal = "NEUTRAL";

	if (rsi > 55 && ema20 > ema50) {
		signal = "BUY";
	}

	if (rsi < 45 && ema20 < ema50) {
		signal = "SELL";
	}

	return {
		signal,

		trend: ema20 > ema50 ? "BULLISH" : "BEARISH",
	};
}
