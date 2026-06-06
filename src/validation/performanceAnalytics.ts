import fs from "fs";
import { SignalOutcomeRepository } from "../storage/repositories/signalOutcomeRepository.js";
import type { OutcomeRecord } from "../types/outcomeRecord.js";

export interface PerformanceMetrics {
	totalSignals: number;

	winningSignals: number;

	losingSignals: number;

	winRate: number;

	lossRate: number;

	averageReturn: number;

	averageWinner: number;

	averageLoser: number;

	profitFactor: number;
}

export interface PerformanceAnalyticsResult {
	overall: PerformanceMetrics;

	bySignal: Record<string, PerformanceMetrics>;

	byQualification: Record<string, PerformanceMetrics>;

	byRegime: Record<string, PerformanceMetrics>;

	byEnvironment: Record<string, PerformanceMetrics>;

	byVolatilityRegime: Record<string, PerformanceMetrics>;

	byConfidenceBucket: Record<string, PerformanceMetrics>;
}

export class PerformanceAnalytics {
	constructor(
		private readonly outcomeRepository = new SignalOutcomeRepository(),
	) {}

	generateReport(): PerformanceAnalyticsResult {
		const outcomes = this.outcomeRepository
			.getAll()
			.filter((o) => o.status !== "OPEN");

		return {
			overall: this.calculateMetrics(outcomes),

			bySignal: this.groupBy(outcomes, (o) => this.normalize(o.signal)),

			byQualification: this.groupBy(outcomes, (o) =>
				this.normalize(o.qualified),
			),

			byRegime: this.groupBy(outcomes, (o) => this.normalize(o.regime)),

			byEnvironment: this.groupBy(outcomes, (o) =>
				this.normalize(o.environment),
			),

			byVolatilityRegime: this.groupBy(outcomes, (o) =>
				this.normalize(o.volatilityRegime),
			),

			byConfidenceBucket: this.groupBy(outcomes, (o) =>
				this.getConfidenceBucket(o.confidence),
			),
		};
	}

	saveReport(filePath = "performance/performanceAnalytics.json"): void {
		const report = this.generateReport();

		fs.mkdirSync("performance", {
			recursive: true,
		});

		fs.writeFileSync(filePath, JSON.stringify(report, null, 2), "utf8");
	}

	private groupBy(
		outcomes: OutcomeRecord[],
		keySelector: (outcome: OutcomeRecord) => string,
	): Record<string, PerformanceMetrics> {
		const groups: Record<string, OutcomeRecord[]> = {};

		for (const outcome of outcomes) {
			const key = keySelector(outcome);

			if (!groups[key]) {
				groups[key] = [];
			}

			groups[key].push(outcome);
		}

		const result: Record<string, PerformanceMetrics> = {};

		for (const [key, values] of Object.entries(groups)) {
			result[key] = this.calculateMetrics(values);
		}

		return result;
	}

	private calculateMetrics(outcomes: OutcomeRecord[]): PerformanceMetrics {
		const totalSignals = outcomes.length;

		const winners = outcomes.filter((o) => o.status === "WIN");

		const losers = outcomes.filter((o) => o.status === "LOSS");

		const winningSignals = winners.length;

		const losingSignals = losers.length;

		if (totalSignals === 0) {
			return {
				totalSignals: 0,
				winningSignals: 0,
				losingSignals: 0,
				winRate: 0,
				lossRate: 0,
				averageReturn: 0,
				averageWinner: 0,
				averageLoser: 0,
				profitFactor: 0,
			};
		}

		const totalReturn = outcomes.reduce(
			(sum, outcome) => sum + outcome.pnlPercent,
			0,
		);

		const grossProfit = winners.reduce(
			(sum, outcome) => sum + outcome.pnlPercent,
			0,
		);

		const grossLoss = Math.abs(
			losers.reduce((sum, outcome) => sum + outcome.pnlPercent, 0),
		);

		return {
			totalSignals,

			winningSignals,

			losingSignals,

			winRate: (winningSignals / totalSignals) * 100,

			lossRate: (losingSignals / totalSignals) * 100,

			averageReturn: totalReturn / totalSignals,

			averageWinner: winningSignals > 0 ? grossProfit / winningSignals : 0,

			averageLoser: losingSignals > 0 ? -grossLoss / losingSignals : 0,

			profitFactor:
				grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? -1 : 0,
		};
	}

	private getConfidenceBucket(confidence: number): string {
		if (confidence >= 90) {
			return "90-100";
		}

		if (confidence >= 80) {
			return "80-89";
		}

		if (confidence >= 70) {
			return "70-79";
		}

		if (confidence >= 60) {
			return "60-69";
		}

		return "<60";
	}

	private normalize(value?: string): string {
		if (!value || value.trim().length === 0) {
			return "UNKNOWN";
		}

		return value.trim().toUpperCase();
	}
}
