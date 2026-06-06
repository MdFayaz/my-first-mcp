import { scanMarket } from "../scanner/marketScanner.js";
import { exportScannerResults } from "../scanner/excelExporter.js";
import { Logger } from "../utils/logger.js";
import { NotificationService } from "../notifications/notificationService.js";
import { AlertDeduplicationService } from "../notifications/alertDeduplicationService.js";
import { AlertDecision } from "../notifications/alertDecision.js";
import { AlertType } from "../notifications/alertTypes.js";
import { NotificationEventType } from "../notifications/notificationTypes.js";

const SCAN_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

function isMarketOpen(): boolean {
	return true;
	// const now = new Date();

	// const indiaTime = new Date(
	// 	now.toLocaleString("en-US", {
	// 		timeZone: "Asia/Kolkata",
	// 	}),
	// );

	// const day = indiaTime.getDay();

	// // Sunday = 0, Saturday = 6
	// if (day === 0 || day === 6) {
	// 	return false;
	// }

	// const hours = indiaTime.getHours();
	// const minutes = indiaTime.getMinutes();

	// const currentMinutes = hours * 60 + minutes;

	// const marketOpen = 9 * 60 + 15;
	// const marketClose = 15 * 60 + 30;

	// return currentMinutes >= marketOpen && currentMinutes <= marketClose;
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runIntradayScanner(): Promise<void> {
	const logger = new Logger();
	const notificationService = new NotificationService();
	const dedupeService = new AlertDeduplicationService();

	logger.info("Intraday scanner started");

	while (true) {
		try {
			if (!isMarketOpen()) {
				logger.info("Market closed. Intraday scanner stopping.");

				break;
			}

			logger.info("Starting market scan");

			const results = await scanMarket();

			// exportScannerResults(results);
			for (const signal of results) {
				if (
					signal.qualified !== "YES" ||
					(signal.signal !== "BUY" && signal.signal !== "STRONG BUY")
				) {
					continue;
				}

				const decision = await dedupeService.evaluate({
					symbol: signal.symbol,
					signalType: signal.signal,
					confidence: signal.confidence,
					qualified: signal.qualified === "YES",
				});

				let alertType = AlertType.ENTRY;

				if (decision === AlertDecision.NEW_SIGNAL) {
					logger.info(`New signal detected: ${signal.symbol}`);
				}

				if (decision === AlertDecision.DUPLICATE_SIGNAL) {
					logger.info(`Duplicate alert skipped: ${signal.symbol}`);
					continue;
				}

				if (decision === AlertDecision.SIGNAL_UPGRADE) {
					logger.info(`Signal upgraded: ${signal.symbol} ${signal.signal}`);
					alertType = AlertType.SIGNAL_UPGRADE;
				}

				if (decision === AlertDecision.CONFIDENCE_UPGRADE) {
					logger.info(`Confidence upgraded: ${signal.symbol} ${signal.signal}`);
					alertType = AlertType.CONFIDENCE_UPGRADE;
				}

				if (decision === AlertDecision.SIGNAL_UPGRADE) {
					alertType = AlertType.SIGNAL_UPGRADE;
				}

				if (decision === AlertDecision.CONFIDENCE_UPGRADE) {
					alertType = AlertType.CONFIDENCE_UPGRADE;
				}

				logger.info(`Alert lifecycle: ${alertType} | ${signal.symbol}`);

				await notificationService.send({
					eventType: NotificationEventType.SIGNAL,

					symbol: signal.symbol,
					signal: signal.signal,
					confidence: signal.confidence,
					score: signal.combinedScore,
					entryPrice: signal.entryPrice,
					qualified: signal.qualified,
					alertDecision: decision,
					alertType,
				});

				await dedupeService.recordAlert({
					symbol: signal.symbol,
					signalType: signal.signal,
					confidence: signal.confidence,
					qualified: signal.qualified === "YES",
				});

				logger.info(`Alert sent: ${signal.symbol} ${signal.signal}`);
			}

			logger.info(`Scan completed. Results: ${results.length}`);
		} catch (error) {
			logger.error(
				error instanceof Error ? (error.stack ?? error.message) : String(error),
			);
		}

		await sleep(SCAN_INTERVAL_MS);
	}

	logger.info("Intraday scanner finished");
}
