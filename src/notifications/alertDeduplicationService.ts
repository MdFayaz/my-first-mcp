import { AlertHistoryRepository } from "../storage/repositories/AlertHistoryRepository.js";

import { AlertDecision } from "./alertDecision.js";

export interface AlertSignal {
	symbol: string;
	signalType: string;

	confidence: number;
	qualified: boolean;
}

export class AlertDeduplicationService {
	constructor(private repository = new AlertHistoryRepository()) {}

	async evaluate(signal: AlertSignal): Promise<AlertDecision> {
		const today = new Date().toISOString().substring(0, 10);

		const latest = await this.repository.findLatestToday(signal.symbol, today);

		if (!latest) {
			return AlertDecision.NEW_SIGNAL;
		}

		if (latest.signalType === "BUY" && signal.signalType === "STRONG BUY") {
			return AlertDecision.SIGNAL_UPGRADE;
		}

		const confidenceImprovement = signal.confidence - latest.confidence;

		if (confidenceImprovement >= 15) {
			return AlertDecision.CONFIDENCE_UPGRADE;
		}

		return AlertDecision.DUPLICATE_SIGNAL;
	}

	async recordAlert(signal: AlertSignal): Promise<void> {
		const today = new Date().toISOString().substring(0, 10);

		await this.repository.create({
			symbol: signal.symbol,
			signalType: signal.signalType,
			confidence: signal.confidence,
			qualified: signal.qualified,
			alertDate: today,
		});
	}
}
