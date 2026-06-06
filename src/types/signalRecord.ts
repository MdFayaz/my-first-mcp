export interface SignalRecord {
	symbol: string;

	signalDate: string;

	direction: string;

	score: number;

	confidence: number;

	entryPrice?: number;

	stopLoss?: number;

	targetPrice?: number;

	setupType?: string;

	reasons?: string;
}
