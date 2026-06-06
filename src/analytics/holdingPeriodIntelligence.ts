import fs from "fs";
import path from "path";

const ANALYTICS_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"holdingPeriodAnalytics.json",
);

const OUTPUT_PATH = path.join(
	process.cwd(),
	"signalHistory",
	"holdingPeriodRecommendations.json",
);

export interface HoldingPeriodRecommendation {
	signalType: string;

	suggestedHoldDays: 1 | 3 | 5;

	historicalReturn: number;

	historicalWinRate: number;

	sampleSize: number;
}

interface SignalAnalytics {
	sampleSize: number;

	avg1d: number;
	avg3d: number;
	avg5d: number;

	winRate1d: number;
	winRate3d: number;
	winRate5d: number;
}

export function generateHoldingPeriodIntelligence() {
	if (!fs.existsSync(ANALYTICS_PATH)) {
		console.log("holdingPeriodAnalytics.json not found.");

		return [];
	}

	const analytics = JSON.parse(fs.readFileSync(ANALYTICS_PATH, "utf-8"));

	const recommendations: HoldingPeriodRecommendation[] = [];

	const signals = analytics.signals ?? {};

	for (const [signalType, stats] of Object.entries(signals)) {
		const signalStats = stats as SignalAnalytics;

		const candidates = [
			{
				days: 1 as const,
				return: signalStats.avg1d,
				winRate: signalStats.winRate1d,
			},
			{
				days: 3 as const,
				return: signalStats.avg3d,
				winRate: signalStats.winRate3d,
			},
			{
				days: 5 as const,
				return: signalStats.avg5d,
				winRate: signalStats.winRate5d,
			},
		];

		candidates.sort((a, b) => b.return - a.return);

		const best = candidates[0];

		if (!best) {
			continue;
		}

		recommendations.push({
			signalType,

			suggestedHoldDays: best.days,

			historicalReturn: Number(best.return.toFixed(2)),

			historicalWinRate: Number(best.winRate.toFixed(2)),

			sampleSize: signalStats.sampleSize,
		});
	}

	fs.writeFileSync(OUTPUT_PATH, JSON.stringify(recommendations, null, 2));

	console.log("Holding period intelligence generated.");

	return recommendations;
}
