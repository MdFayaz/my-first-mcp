import type { PendingPrediction } from "../validation/predictionTracker.js";

export class SignalMaturityService {
	isMature(signalDate: string, requiredTradingDays: number): boolean {
		const signal = new Date(signalDate);

		const today = new Date();

		let tradingDays = 0;

		const current = new Date(signal);

		while (current < today) {
			current.setDate(current.getDate() + 1);

			const day = current.getDay();

			const isWeekend = day === 0 || day === 6;

			if (!isWeekend) {
				tradingDays++;
			}
		}

		return tradingDays >= requiredTradingDays;
	}

	getMatureSignals(
		signals: PendingPrediction[],
		requiredTradingDays: number,
	): PendingPrediction[] {
		return signals.filter((signal) =>
			this.isMature(signal.signalDate, requiredTradingDays),
		);
	}
}
