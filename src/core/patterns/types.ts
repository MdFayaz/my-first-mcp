export interface PatternResult {
	name: string;

	signal: "BUY" | "SELL" | "NEUTRAL";

	strength: number;

	reason: string;
}
