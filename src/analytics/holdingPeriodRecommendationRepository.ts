import fs from "fs";
import path from "path";

export interface HoldingPeriodRecommendation {
	signalType: string;

	suggestedHoldDays: number;

	historicalReturn: number;

	historicalWinRate: number;

	sampleSize: number;
}

export class HoldingPeriodRecommendationRepository {
	private readonly filePath = path.join(
		process.cwd(),
		"signalHistory",
		"holdingPeriodRecommendations.json",
	);

	getRecommendation(signalType: string): HoldingPeriodRecommendation | null {
		if (!fs.existsSync(this.filePath)) {
			return null;
		}

		const recommendations: HoldingPeriodRecommendation[] = JSON.parse(
			fs.readFileSync(this.filePath, "utf8"),
		);

		return recommendations.find((r) => r.signalType === signalType) ?? null;
	}
}
