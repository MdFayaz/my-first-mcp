import type { SRLevel } from "../structure/supportResistance.js";

export function calculateStructureScore(
	currentPrice: number,
	levels: SRLevel[],

	trend: "BULLISH" | "BEARISH" | "SIDEWAYS",

	breakout?: boolean,
): number {
	let score = 0;

	for (const level of levels) {
		const distance =
			(Math.abs(currentPrice - level.price) / currentPrice) * 100;

		// Ignore distant levels
		if (distance >= 0.5) {
			continue;
		}

		// ======================
		// SUPPORT LOGIC
		// ======================

		if (level.type === "SUPPORT") {
			// Bullish continuation
			if (trend === "BULLISH") {
				score += level.strength * 0.25;
			}

			// Bearish environment
			else if (trend === "BEARISH") {
				score += level.strength * 0.1;
			}

			// Sideways
			else {
				score += level.strength * 0.15;
			}
		}

		// ======================
		// RESISTANCE LOGIC
		// ======================

		if (level.type === "RESISTANCE") {
			// Strong bullish breakout
			if (trend === "BULLISH" && breakout) {
				// very small penalty
				score -= level.strength * 0.05;
			}

			// Bullish continuation
			else if (trend === "BULLISH") {
				score -= level.strength * 0.1;
			}

			// Bearish rejection
			else if (trend === "BEARISH") {
				score -= level.strength * 0.25;
			}

			// Sideways
			else {
				score -= level.strength * 0.15;
			}
		}
	}

	return Math.max(-100, Math.min(100, Number(score.toFixed(2))));
}
