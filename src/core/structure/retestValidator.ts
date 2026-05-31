import type { Candle } from "../indicators/types.js";

export interface RetestResult {
	retestConfirmed: boolean;

	retestStrength: number;
}

export function validateRetest(
	candles: Candle[],
	breakoutLevel: number,
	direction: "BULLISH" | "BEARISH",
): RetestResult {
	if (!candles.length) {
		return {
			retestConfirmed: false,
			retestStrength: 0,
		};
	}
	const latest = candles[candles.length - 1]!;

	let retestConfirmed = false;
	let retestStrength = 0;

	// ======================
	// Bullish Retest
	// ======================

	if (
		direction === "BULLISH" &&
		latest.low <= breakoutLevel &&
		latest.close > breakoutLevel
	) {
		retestConfirmed = true;

		retestStrength = latest.close - breakoutLevel;
	}

	// ======================
	// Bearish Retest
	// ======================

	if (
		direction === "BEARISH" &&
		latest.high >= breakoutLevel &&
		latest.close < breakoutLevel
	) {
		retestConfirmed = true;

		retestStrength = breakoutLevel - latest.close;
	}

	return {
		retestConfirmed,
		retestStrength: Number(retestStrength.toFixed(2)),
	};
}
