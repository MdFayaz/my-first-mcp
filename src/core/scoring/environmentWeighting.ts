export interface EnvironmentWeightingResult {
	scoreMultiplier: number;
	confidenceMultiplier: number;
	environment: string;
	reason: string;
}

export function getEnvironmentWeighting(
	regime: string,
	volatilityRegime: string,
): EnvironmentWeightingResult {
	// =====================
	// TREND ENVIRONMENTS
	// =====================

	if (regime === "TREND" && volatilityRegime === "EXPANSION") {
		return {
			scoreMultiplier: 1.15,
			confidenceMultiplier: 1.1,
			environment: "TREND_EXPANSION",
			reason: "Favorable continuation environment",
		};
	}

	if (regime === "TREND" && volatilityRegime === "HIGH_VOLATILITY") {
		return {
			scoreMultiplier: 1.1,
			confidenceMultiplier: 1.05,
			environment: "TREND_HIGH_VOLATILITY",
			reason: "Strong directional move underway",
		};
	}

	// =====================
	// RANGE ENVIRONMENTS
	// =====================

	if (regime === "RANGE" && volatilityRegime === "COMPRESSION") {
		return {
			scoreMultiplier: 0.85,
			confidenceMultiplier: 0.9,
			environment: "RANGE_COMPRESSION",
			reason: "Potential breakout setup",
		};
	}

	if (regime === "RANGE" && volatilityRegime === "NORMAL_VOLATILITY") {
		return {
			scoreMultiplier: 0.9,
			confidenceMultiplier: 0.95,
			environment: "RANGE_NORMAL",
			reason: "Range-bound environment",
		};
	}

	// =====================
	// CHOPPY ENVIRONMENTS
	// =====================

	if (regime === "CHOPPY" && volatilityRegime === "HIGH_VOLATILITY") {
		return {
			scoreMultiplier: 0.8,
			confidenceMultiplier: 0.8,
			environment: "CHOPPY_HIGH_VOLATILITY",
			reason: "Whipsaw risk environment",
		};
	}

	// =====================
	// DEFAULT
	// =====================

	return {
		scoreMultiplier: 1,
		confidenceMultiplier: 1,
		environment: `${regime}_${volatilityRegime}`,
		reason: "Neutral environment",
	};
}
