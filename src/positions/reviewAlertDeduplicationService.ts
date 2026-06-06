import fs from "fs";
import path from "path";
import type { ExitReviewAlert } from "./exitReviewAlertService.js";
import { ReviewAlertHistoryRepository } from "./reviewAlertHistoryRepository.js";
import type { SentReviewAlert } from "./reviewAlertHistoryRepository.js";

export class ReviewAlertDeduplicationService {
	private readonly filePath = path.resolve("data", "reviewAlertsSent.json");

	private repository: ReviewAlertHistoryRepository;

	constructor() {
		this.repository = new ReviewAlertHistoryRepository();
	}

	filterNewAlerts(alerts: ExitReviewAlert[]): ExitReviewAlert[] {
		const sentAlerts = this.repository.getAll();

		const newAlerts = alerts.filter((alert) => {
			return !sentAlerts.some(
				(sent) => sent.symbol === alert.symbol && sent.reason === alert.reason,
			);
		});

		if (newAlerts.length > 0) {
			this.recordAlerts(newAlerts);
		}

		return newAlerts;
	}

	private recordAlerts(alerts: ExitReviewAlert[]): void {
		const additions: SentReviewAlert[] = alerts.map((alert) => ({
			symbol: alert.symbol,
			signal: alert.signal,
			reason: alert.reason,
			alertedAt: new Date().toISOString(),
		}));

		this.repository.append(additions);
	}
}
