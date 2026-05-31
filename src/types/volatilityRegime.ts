export type VolatilityRegime =
	| "COMPRESSION"
	| "NORMAL_VOLATILITY"
	| "EXPANSION"
	| "HIGH_VOLATILITY";

export interface VolatilityRegimeAnalysis {
	volatilityRegime: VolatilityRegime;

	confidence: number;

	atrRatio: number;

	volatilityScore: number;

	reasons: string[];
}
