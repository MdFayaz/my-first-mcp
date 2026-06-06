export interface SignalOutcome {
	timestamp: string;
	symbol: string;

	signal: string;

	entryPrice: number;
	currentPrice: number;

	pnlPercent: number;

	status: "WIN" | "LOSS" | "OPEN";

	score: number;
	confidence: number;

	qualified: boolean;

	evaluatedAt: string;
}

export interface ConfidenceCalibrationStat {
	confidence: number;

	totalSignals: number;

	completedTrades: number;

	wins: number;
	losses: number;
	open: number;

	reliable: boolean;

	winRate: number;

	averageReturn: number;

	expectancy: number;
}

export interface ConfidenceCalibrationReport {
	generatedAt: string;

	sampleSize: number;

	confidenceStats: ConfidenceCalibrationStat[];
}

export interface RiskRewardOptimization {
	generatedAt: string;

	sampleSize: number;

	recommendedStopLoss: number;

	conservativeTarget: number;

	aggressiveTarget: number;

	riskRewardRatioConservative: number;

	riskRewardRatioAggressive: number;
}
export interface PositionSizingRule {
	confidence: number;

	winRate: number;

	completedTrades: number;

	reliable: boolean;

	positionSizeMultiplier: number;

	capitalAllocationPercent: number;

	riskPerTradePercent: number;

	recommendation: string;
	expectancy: number;
}

export interface PositionSizingReport {
	generatedAt: string;

	rules: PositionSizingRule[];
}
