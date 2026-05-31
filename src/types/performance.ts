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
