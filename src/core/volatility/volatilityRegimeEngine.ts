import type {
	VolatilityRegime,
	VolatilityRegimeAnalysis,
} from "../../types/volatilityRegime.js";

export function detectVolatilityRegime(
	currentATR: number,
	averageATR: number,
): VolatilityRegimeAnalysis {
	const reasons: string[] = [];

	const atrRatio = averageATR > 0 ? currentATR / averageATR : 1;

	let volatilityRegime: VolatilityRegime = "NORMAL_VOLATILITY";

	let confidence = 50;

	if (atrRatio < 0.8) {
		volatilityRegime = "COMPRESSION";

		confidence = Math.round(70 + (0.8 - atrRatio) * 100);

		reasons.push("ATR below normal range", "Volatility compression detected");
	} else if (atrRatio <= 1.2) {
		volatilityRegime = "NORMAL_VOLATILITY";

		confidence = Math.round(80 - Math.abs(1 - atrRatio) * 50);

		reasons.push("ATR within normal range", "Balanced volatility environment");
	} else if (atrRatio <= 1.5) {
		volatilityRegime = "EXPANSION";

		confidence = Math.round(75 + (atrRatio - 1.2) * 50);

		reasons.push("ATR expanding", "Momentum expansion detected");
	} else {
		volatilityRegime = "HIGH_VOLATILITY";

		confidence = Math.min(100, Math.round(85 + (atrRatio - 1.5) * 30));

		reasons.push("ATR significantly above average", "High volatility regime");
	}

	return {
		volatilityRegime,

		confidence,

		atrRatio: Number(atrRatio.toFixed(2)),

		volatilityScore: Math.min(100, Math.round(atrRatio * 50)),

		reasons,
	};
}
