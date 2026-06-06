import { PredictionTracker } from "./predictionTracker.js";

import { HistoricalPriceService } from "../services/historicalPriceService.js";

import { SignalOutcomeRepository } from "../storage/repositories/signalOutcomeRepository.js";

import { SignalMaturityService } from "../services/signalMaturityService.js";

export class OutcomeTracker {
	constructor(
		private readonly predictionTracker = new PredictionTracker(),

		private readonly historicalPriceService = new HistoricalPriceService(),

		private readonly signalOutcomeRepository = new SignalOutcomeRepository(),

		private readonly signalMaturityService = new SignalMaturityService(),
	) {}

	async evaluatePendingSignals(): Promise<void> {
		const predictions = this.signalMaturityService.getMatureSignals(
			this.predictionTracker.getPendingPredictions(),
			5,
		);

		console.log(`Evaluating ${predictions.length} signals`);
		if (predictions.length === 0) {
			console.log("No mature signals available");

			return;
		}
		for (const prediction of predictions) {
			try {
				const close5d =
					await this.historicalPriceService.getCloseAfterTradingDays(
						prediction.symbol,
						prediction.signalDate,
						5,
					);

				if (close5d === null) {
					console.log(`${prediction.symbol}: insufficient future data`);

					continue;
				}
				const entryPrice = prediction.entryPrice;

				if (entryPrice === undefined || entryPrice <= 0) {
					console.warn(`Skipping ${prediction.symbol}: missing entry price`);

					continue;
				}

				const pnlPercent = prediction.direction.includes("SELL")
					? ((entryPrice - close5d) / entryPrice) * 100
					: ((close5d - entryPrice) / entryPrice) * 100;

				const status = pnlPercent > 0 ? "WIN" : "LOSS";

				this.signalOutcomeRepository.upsert({
					signalId: prediction.signalId,

					symbol: prediction.symbol,

					signalDate: prediction.signalDate,

					signal: prediction.direction,

					confidence: prediction.confidence,

					qualified: "YES",

					regime: "",

					environment: "",

					volatilityRegime: "",

					status,

					pnlPercent: Number(pnlPercent.toFixed(2)),

					holdingDays: 5,

					maxDrawdown: 0,

					evaluatedAt: new Date().toISOString(),
				});

				console.log(`${prediction.symbol} => ${status}`);
			} catch (error) {
				console.error(
					`Outcome evaluation failed for ${prediction.symbol}`,
					error,
				);
			}
		}
	}
}
