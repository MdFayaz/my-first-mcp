export type MarketRegime = "STRONG_TREND" | "TREND" | "RANGE" | "CHOPPY";

export interface MarketRegimeAnalysis {
	regime: MarketRegime;

	trendStrength: number;

	adxProxy: number;

	rangeScore: number;

	confidence: number;

	reasons: string[];
}
