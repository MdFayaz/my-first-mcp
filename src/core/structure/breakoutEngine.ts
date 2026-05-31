import type { Candle } from "../indicators/types.js";
import type { SRLevel } from "./supportResistance.js";

export interface BreakoutEngineResult {
	breakout: boolean;

	direction: "BULLISH" | "BEARISH" | "NONE";

	breakoutLevel: number;

	candleCloseStrength: number;

	breakoutStrength: number;
}

export function detectBreakout(
	candles: Candle[],
	srLevels: SRLevel[],
	atr: number,
	macdHistogram: number,
	rsi: number,
	rvol?: number,
	expansionRatio?: number,
): BreakoutEngineResult {
	// ======================
	// SAFETY CHECK
	// ======================

	if (!candles.length) {
		return {
			breakout: false,
			direction: "NONE",
			breakoutLevel: 0,
			candleCloseStrength: 0,
			breakoutStrength: 0,
		};
	}

	const latest = candles[candles.length - 1]!;
	const candleBody = Math.abs(latest.close - latest.open);

	const bullishMomentum = macdHistogram > 0 && rsi > 52;

	const bearishMomentum = macdHistogram < 0 && rsi < 48;

	const strongBody = candleBody > atr * 0.4;

	let breakout = false;

	let direction: "BULLISH" | "BEARISH" | "NONE" = "NONE";

	let breakoutLevel = 0;

	let candleCloseStrength = 0;

	let breakoutStrength = 0;

	// ======================
	// FIND LEVELS
	// ======================

	const resistanceLevels = srLevels.filter(
		(level) => level.type === "RESISTANCE",
	);

	const supportLevels = srLevels.filter((level) => level.type === "SUPPORT");

	const resistance = resistanceLevels[resistanceLevels.length - 1];

	const support = supportLevels[supportLevels.length - 1];

	// ======================
	// BULLISH BREAKOUT
	// ======================

	const breakoutThreshold = atr * 0.15;

	const bullishPriceBreak =
		resistance != null && latest.close > resistance.price;

	if (bullishPriceBreak && bullishMomentum) {
		breakout = true;

		direction = "BULLISH";

		breakoutLevel = resistance.price;

		candleCloseStrength = (latest.close - resistance.price) / atr;

		breakoutStrength = (candleBody / atr) * 10;
	}
	// ======================
	// VOLUME CONFIRMATION
	// ======================

	const strongParticipation = (rvol ?? 0) >= 1.3;

	const expandingVolume = (expansionRatio ?? 0) >= 1.2;
	if (!strongParticipation && !expandingVolume) {
		breakoutStrength -= 15;
	}
	// ======================
	// BEARISH BREAKOUT
	// ======================
	const bearishPriceBreak = support != null && latest.close < support.price;

	if (bearishPriceBreak && bearishMomentum) {
		breakout = true;

		direction = "BEARISH";

		breakoutLevel = support.price;

		candleCloseStrength = (support.price - latest.close) / atr;

		breakoutStrength = (candleBody / atr) * 10;
	}

	console.log({
		close: latest.close,

		resistance: resistance?.price,

		support: support?.price,

		bullishPriceBreak,

		bearishPriceBreak,

		breakout,
	});
	return {
		breakout,

		direction,

		breakoutLevel,

		candleCloseStrength: Number(candleCloseStrength.toFixed(2)),

		breakoutStrength: Number(breakoutStrength.toFixed(2)),
	};
}
