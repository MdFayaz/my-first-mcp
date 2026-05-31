export interface ConfluenceInput {
	rsiScore: number;
	macdScore: number;
	trendStrength: number;
	structureScore: number;
	patternScore: number;
	rejectionScore: number;
	volatilityScore: number;
	breakoutScore: number;

	vwapPosition: "ABOVE" | "BELOW";
	vwapStrength: number;
}

export function calculateConfluenceScore(input: ConfluenceInput): number {
	const rsi = input.rsiScore * 0.08;

	const macd = input.macdScore * 0.12;

	const trend = input.trendStrength * 0.1;

	const structure = input.structureScore * 0.18;

	const pattern = input.patternScore * 0.12;

	const rejection = input.rejectionScore * 0.08;

	const volatility = input.volatilityScore * 0.07;

	const breakout = input.breakoutScore * 0.15;

	// ======================
	// VWAP
	// ======================

	let vwapScore = 0;

	if (input.vwapPosition === "ABOVE") {
		vwapScore += 4;
	} else {
		vwapScore -= 4;
	}

	if (input.vwapStrength > 2) {
		vwapScore += input.vwapPosition === "ABOVE" ? 2 : -2;
	}

	console.log({
		rsi,
		macd,
		trend,
		structure,
		pattern,
		rejection,
		volatility,
		breakout,
		vwapScore,
	});

	const total =
		rsi +
		macd +
		trend +
		structure +
		pattern +
		rejection +
		volatility +
		breakout +
		vwapScore;

	console.log("TOTAL:", total);

	return Number(total.toFixed(2));
}
