import fs from "fs";
import { PerformanceAnalytics } from "../validation/performanceAnalytics.js";

export interface ScoreRecommendation {
	category: string;

	target: string;

	adjustment: number;

	reason: string;

	confidence: "LOW" | "MEDIUM" | "HIGH";
}

export interface ScoreRecommendationReport {
	generatedAt: string;

	sampleSize: number;

	recommendations: ScoreRecommendation[];
}

export class ScoreRecommendationEngine {
	private static readonly MIN_SAMPLE_SIZE = 30;

	constructor(private readonly analytics = new PerformanceAnalytics()) {}

	generateReport(): ScoreRecommendationReport {
		const report = this.analytics.generateReport();

		const sampleSize = report.overall.totalSignals;

		if (sampleSize < ScoreRecommendationEngine.MIN_SAMPLE_SIZE) {
			return {
				generatedAt: new Date().toISOString(),

				sampleSize,

				recommendations: [
					{
						category: "SYSTEM",

						target: "GLOBAL",

						adjustment: 0,

						reason: "Insufficient sample size",

						confidence: "LOW",
					},
				],
			};
		}

		const recommendations: ScoreRecommendation[] = [];

		this.evaluateCategory(
			recommendations,
			"QUALIFICATION",
			report.byQualification,
		);

		this.evaluateCategory(
			recommendations,
			"CONFIDENCE_BUCKET",
			report.byConfidenceBucket,
		);

		this.evaluateCategory(recommendations, "REGIME", report.byRegime);

		this.evaluateCategory(recommendations, "ENVIRONMENT", report.byEnvironment);

		this.evaluateCategory(
			recommendations,
			"VOLATILITY",
			report.byVolatilityRegime,
		);

		return {
			generatedAt: new Date().toISOString(),

			sampleSize,

			recommendations,
		};
	}

	saveReport(filePath = "performance/scoreRecommendations.json"): void {
		const report = this.generateReport();

		fs.mkdirSync("performance", {
			recursive: true,
		});

		fs.writeFileSync(filePath, JSON.stringify(report, null, 2), "utf8");
	}

	private evaluateCategory(
		recommendations: ScoreRecommendation[],
		category: string,
		data: Record<string, { winRate: number }>,
	): void {
		for (const [target, metrics] of Object.entries(data)) {
			const adjustment = this.calculateAdjustment(metrics.winRate);

			if (adjustment === 0) {
				continue;
			}

			recommendations.push({
				category,

				target,

				adjustment,

				reason: `${metrics.winRate.toFixed(2)}% win rate`,

				confidence: this.calculateConfidence(adjustment),
			});
		}
	}

	private calculateAdjustment(winRate: number): number {
		if (winRate >= 65) {
			return 3;
		}

		if (winRate >= 55) {
			return 1;
		}

		if (winRate <= 35) {
			return -3;
		}

		if (winRate <= 45) {
			return -1;
		}

		return 0;
	}

	private calculateConfidence(adjustment: number): "LOW" | "MEDIUM" | "HIGH" {
		const abs = Math.abs(adjustment);

		if (abs >= 3) {
			return "HIGH";
		}

		if (abs >= 1) {
			return "MEDIUM";
		}

		return "LOW";
	}
}
