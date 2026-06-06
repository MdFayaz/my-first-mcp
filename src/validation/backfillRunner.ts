import { ProcessingStateService } from "../services/processingStateService.js";
import { TradingCalendarService } from "../services/tradingCalendarService.js";
import { RunHistoryService } from "../services/runHistoryService.js";
import { DailyValidator } from "./dailyValidator.js";

export class BackfillRunner {
	private readonly validator = new DailyValidator();

	constructor(
		private readonly stateService = new ProcessingStateService(),

		private readonly calendarService = new TradingCalendarService(),

		private readonly runHistoryService = new RunHistoryService(),
	) {}

	async run(): Promise<void> {
		const lastProcessedDate = this.stateService.getLastProcessedDate();

		const latestTradingDate = this.calendarService.getLatestTradingDate();

		if (!lastProcessedDate) {
			console.log("No previous processing state found.");

			return;
		}

		const missingDates = this.calendarService.getTradingDaysBetween(
			lastProcessedDate,
			latestTradingDate,
		);

		if (missingDates.length === 0) {
			console.log("No missing trading dates.");

			return;
		}

		console.log(`Found ${missingDates.length} missing trading days`);

		for (const date of missingDates) {
			const runId = this.runHistoryService.startRun(date);

			try {
				await this.validator.processDate(date);
				/**
				 * Future:
				 *
				 * DailyValidator.processDate(date)
				 */

				this.stateService.setLastProcessedDate(date);

				this.runHistoryService.completeRun(runId);
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);

				this.runHistoryService.failRun(runId, message);
			}
		}
	}
}
