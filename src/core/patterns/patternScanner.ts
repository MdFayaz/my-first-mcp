import type { Candle } from "../indicators/types.js";

import type { PatternResult } from "./types.js";

import { isHammer } from "./single/hammer.js";

import { isBullishEngulfing } from "./double/bullishEngulfing.js";

import { isDoji } from "./single/doji.js";

import { isBullishMarubozu } from "./single/marubozu.js";

export function scanPatterns(candles: Candle[]): PatternResult[] {
	const patterns: PatternResult[] = [];

	if (candles.length < 2) {
		return patterns;
	}

	const current = candles[candles.length - 1]!; // exclamation mark asserts that this value is not undefined, or guarantees that it will be defined at runtime

	const previous = candles[candles.length - 2]!;
	// console.error("Hammer:", isHammer(current));

	// console.error("Bullish Engulfing:", isBullishEngulfing(previous, current));

	// Hammer
	if (isHammer(current)) {
		patterns.push({
			name: "Hammer",

			signal: "BUY",

			strength: 7,

			reason: "Bullish rejection from lower levels",
		});
	}

	// Bullish Engulfing
	if (isBullishEngulfing(previous, current)) {
		patterns.push({
			name: "Bullish Engulfing",

			signal: "BUY",

			strength: 9,

			reason: "Strong bullish reversal pattern",
		});
	}

	if (isDoji(current)) {
		patterns.push({
			name: "Doji",

			signal: "NEUTRAL",

			strength: 5,

			reason: "Market indecision detected",
		});
	}

	if (isBullishMarubozu(current)) {
		patterns.push({
			name: "Bullish Marubozu",

			signal: "BUY",

			strength: 8,

			reason: "Strong bullish momentum candle",
		});
	}

	return patterns;
}
