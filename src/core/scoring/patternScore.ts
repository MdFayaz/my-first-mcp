import type { PatternResult } from "../patterns/types.js";

export function calculatePatternScore(patterns: PatternResult[]) {
	let bullishScore = 0;

	let bearishScore = 0;

	const reasons: string[] = [];

	for (const pattern of patterns) {
		if (pattern.signal === "BUY") {
			bullishScore += pattern.strength * 5;

			reasons.push(pattern.name);
		}

		if (pattern.signal === "SELL") {
			bearishScore += pattern.strength * 5;

			reasons.push(pattern.name);
		}
	}

	return {
		bullishScore,
		bearishScore,
		reasons,
	};
}
