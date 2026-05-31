export interface FinalScoreInput {
	baseScore: number;

	mtfScore: number;

	breakoutConfirmed: boolean;

	fakeBreakout: boolean;

	trendStrength: number;
}

export function calculateFinalScore(input: FinalScoreInput): number {
	let finalScore = input.baseScore * 0.7 + input.mtfScore * 0.3;

	// breakout bonus
	if (input.breakoutConfirmed) {
		finalScore += 5;
	}

	// strong trend bonus
	if (input.trendStrength > 70) {
		finalScore += 5;
	}

	// fake breakout penalty
	if (input.fakeBreakout) {
		finalScore -= 15;
	}

	return Number(Math.max(0, Math.min(100, finalScore)).toFixed(2));
}
