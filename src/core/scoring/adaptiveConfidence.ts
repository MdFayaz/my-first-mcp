import fs from "fs";

import path from "path";

const WEIGHTS_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"adaptiveWeights.json",
);

export function applyAdaptiveConfidence(
	symbol: string,

	signal: string,

	confidence: number,
) {
	try {
		if (!fs.existsSync(WEIGHTS_PATH)) {
			return {
				adjustedConfidence: confidence,

				signalMultiplier: 1,
			};
		}

		const raw = fs.readFileSync(WEIGHTS_PATH, "utf-8");

		const weights = JSON.parse(raw);

		const signalMultiplier = weights.signalWeights?.[signal] ?? 1;

		const adjustedConfidence = confidence * signalMultiplier;

		return {
			adjustedConfidence: Math.min(
				100,

				Number(adjustedConfidence.toFixed(2)),
			),

			signalMultiplier,
		};
	} catch (error) {
		console.error("Adaptive confidence failed:", error);

		return {
			adjustedConfidence: confidence,

			signalMultiplier: 1,
		};
	}
}
