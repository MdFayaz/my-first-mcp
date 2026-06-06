export interface OutcomeRecord {
	signalId: number;

	symbol: string;

	signalDate: string;

	signal: string;

	confidence: number;

	qualified?: string;

	regime?: string;

	environment?: string;

	volatilityRegime?: string;

	status: "WIN" | "LOSS" | "OPEN";

	pnlPercent: number;

	holdingDays: number;

	maxDrawdown?: number;

	evaluatedAt: string;
}
