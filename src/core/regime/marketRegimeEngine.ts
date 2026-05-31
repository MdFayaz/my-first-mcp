import type {
	MarketRegime,
	MarketRegimeAnalysis,
} from "../../types/marketRegime.js";

export function detectMarketRegime(
	trendStrength: number,
	atr: number,
	atrAverage: number,
	price: number,
	sma20: number,
): MarketRegimeAnalysis {
	const reasons: string[] = [];

	const atrRatio = atrAverage > 0 ? atr / atrAverage : 1;

	const distanceFromSMA = sma20 > 0 ? Math.abs(price - sma20) / sma20 : 0;

	let regime: MarketRegime = "CHOPPY";
	let confidence = 50;

	if (trendStrength >= 85) {
		regime = "STRONG_TREND";

		confidence = Math.min(100, trendStrength);

		reasons.push("Very strong directional trend");
	} else if (trendStrength >= 60) {
		regime = "TREND";

		confidence = Math.min(100, trendStrength);

		reasons.push("Established directional trend");
	} else if (trendStrength <= 30) {
		regime = "RANGE";

		confidence = 70;

		reasons.push("Weak directional movement");
	} else {
		regime = "CHOPPY";

		confidence = 60;

		reasons.push("Mixed directional behavior");
	}

	return {
		regime,
		trendStrength,
		adxProxy: trendStrength,
		rangeScore: Math.max(0, Math.min(100, 100 - trendStrength)),
		confidence,
		reasons,
	};
}
