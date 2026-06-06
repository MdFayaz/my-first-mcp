import fs from "fs";
import {
	PerformanceAnalytics,
	type PerformanceAnalyticsResult,
	type PerformanceMetrics,
} from "../validation/performanceAnalytics.js";

export interface AdaptiveFeedback {
	generatedAt: string;

	qualificationFeedback: {
		recommendation: string;

		qualifiedWinRate: number;

		unqualifiedWinRate: number;
	};

	confidenceFeedback: {
		bestBucket: string;

		bestWinRate: number;
	};

	regimeFeedback: {
		bestRegime: string;

		bestWinRate: number;
	};

	environmentFeedback: {
		bestEnvironment: string;

		bestWinRate: number;
	};

	volatilityFeedback: {
		bestVolatilityRegime: string;

		bestWinRate: number;
	};
}

export class AdaptiveFeedbackEngine {
	constructor(private readonly analytics = new PerformanceAnalytics()) {}

	generateReport(): AdaptiveFeedback {
		const report = this.analytics.generateReport();

		const qualifiedWinRate = report.byQualification["YES"]?.winRate ?? 0;

		const unqualifiedWinRate = report.byQualification["NO"]?.winRate ?? 0;

		const recommendation =
			qualifiedWinRate > unqualifiedWinRate + 10
				? "KEEP_QUALIFICATION_FILTER"
				: "REVIEW_QUALIFICATION_FILTER";

		const confidence = this.getBestPerformer(report.byConfidenceBucket);

		const regime = this.getBestPerformer(report.byRegime);

		const environment = this.getBestPerformer(report.byEnvironment);

		const volatility = this.getBestPerformer(report.byVolatilityRegime);

		return {
			generatedAt: new Date().toISOString(),

			qualificationFeedback: {
				recommendation,
				qualifiedWinRate,
				unqualifiedWinRate,
			},

			confidenceFeedback: {
				bestBucket: confidence.key,
				bestWinRate: confidence.winRate,
			},

			regimeFeedback: {
				bestRegime: regime.key,
				bestWinRate: regime.winRate,
			},

			environmentFeedback: {
				bestEnvironment: environment.key,
				bestWinRate: environment.winRate,
			},

			volatilityFeedback: {
				bestVolatilityRegime: volatility.key,
				bestWinRate: volatility.winRate,
			},
		};
	}

	saveReport(filePath = "performance/adaptiveFeedback.json"): void {
		const report = this.generateReport();

		fs.mkdirSync("performance", {
			recursive: true,
		});

		fs.writeFileSync(filePath, JSON.stringify(report, null, 2), "utf8");
	}

	private getBestPerformer(data: Record<string, PerformanceMetrics>): {
		key: string;
		winRate: number;
	} {
		let bestKey = "UNKNOWN";

		let bestWinRate = 0;

		for (const [key, metrics] of Object.entries(data)) {
			if (metrics.winRate > bestWinRate) {
				bestKey = key;
				bestWinRate = metrics.winRate;
			}
		}

		return {
			key: bestKey,
			winRate: bestWinRate,
		};
	}
}
