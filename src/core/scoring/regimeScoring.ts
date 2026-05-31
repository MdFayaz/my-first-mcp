export interface RegimeScoringResult {
	confidenceAdjustment: number;
	rankingAdjustment: number;
	regimeReason: string;
}

export function applyRegimeScoring(regime: string): RegimeScoringResult {
	switch (regime) {
		case "STRONG_TREND":
			return {
				confidenceAdjustment: 10,
				rankingAdjustment: 10,
				regimeReason: "Strong trend environment",
			};

		case "TREND":
			return {
				confidenceAdjustment: 5,
				rankingAdjustment: 5,
				regimeReason: "Trending market environment",
			};

		case "CHOPPY":
			return {
				confidenceAdjustment: -10,
				rankingAdjustment: -5,
				regimeReason: "Choppy market penalty",
			};

		case "RANGE":
			return {
				confidenceAdjustment: -5,
				rankingAdjustment: -10,
				regimeReason: "Range-bound market penalty",
			};

		default:
			return {
				confidenceAdjustment: 0,
				rankingAdjustment: 0,
				regimeReason: "Unknown regime",
			};
	}
}
