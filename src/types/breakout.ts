export interface BreakoutResult {
	breakout: boolean;

	direction: "BULLISH" | "BEARISH" | "NONE";

	breakoutLevel: number;

	breakoutStrength: number;

	candleCloseStrength: number;

	volumeExpansion: boolean;

	retestConfirmed: boolean;

	fakeBreakout: boolean;

	score: number;
}
