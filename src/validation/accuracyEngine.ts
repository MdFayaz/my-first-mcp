import { SignalOutcomeRepository } from "../storage/repositories/signalOutcomeRepository.js";

export interface AccuracyMetrics {
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

export class AccuracyEngine {
	constructor(
		private readonly outcomeRepository = new SignalOutcomeRepository(),
	) {}

	calculate(): AccuracyMetrics {
		const outcomes = this.outcomeRepository.getAll();

		const evaluated = outcomes.filter(
			(o) =>
				o.pnlPercent !== null &&
				o.pnlPercent !== undefined &&
				!Number.isNaN(o.pnlPercent),
		);

		const totalSignals = evaluated.length;

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

		const winners = evaluated.filter((o) => o.pnlPercent > 0);

		const losers = evaluated.filter((o) => o.pnlPercent < 0);

		const winningSignals = winners.length;

		const losingSignals = losers.length;

		const totalReturn = evaluated.reduce((sum, o) => sum + o.pnlPercent, 0);

		const grossProfit = winners.reduce((sum, o) => sum + o.pnlPercent, 0);

		const grossLoss = Math.abs(
			losers.reduce((sum, o) => sum + o.pnlPercent, 0),
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
				grossLoss > 0
					? grossProfit / grossLoss
					: grossProfit > 0
						? Number.POSITIVE_INFINITY
						: 0,
		};
	}
}
