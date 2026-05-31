import fs from "fs";
import path from "path";

const FEEDBACK_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"reliabilityFeedback.json",
);

export interface ReliabilityFeedback {
	regimeMultipliers: Record<string, number>;
	volatilityMultipliers: Record<string, number>;
	environmentMultipliers: Record<string, number>;
}

export function loadReliabilityFeedback(): ReliabilityFeedback {
	if (!fs.existsSync(FEEDBACK_PATH)) {
		return {
			regimeMultipliers: {},
			volatilityMultipliers: {},
			environmentMultipliers: {},
		};
	}

	try {
		return JSON.parse(fs.readFileSync(FEEDBACK_PATH, "utf-8"));
	} catch {
		return {
			regimeMultipliers: {},
			volatilityMultipliers: {},
			environmentMultipliers: {},
		};
	}
}
