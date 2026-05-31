import fs from "fs";

import path from "path";

const WEIGHTS_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"adaptiveWeights.json",
);

export function applyAdaptiveWeights(
	symbol: string,

	signal: string,

	score: number,
) {
	try {
		if (!fs.existsSync(WEIGHTS_PATH)) {
			return {
				adjustedScore: score,

				signalMultiplier: 1,

				symbolMultiplier: 1,
			};
		}

		const raw = fs.readFileSync(WEIGHTS_PATH, "utf-8");

		const weights = JSON.parse(raw);

		const signalMultiplier = weights.signalWeights?.[signal] ?? 1;

		const symbolMultiplier = weights.symbolWeights?.[symbol] ?? 1;

		const adjustedScore = score * signalMultiplier * symbolMultiplier;

		return {
			adjustedScore: Number(adjustedScore.toFixed(2)),

			signalMultiplier,

			symbolMultiplier,
		};
	} catch (error) {
		console.error("Adaptive scoring failed:", error);

		return {
			adjustedScore: score,

			signalMultiplier: 1,

			symbolMultiplier: 1,
		};
	}
}
