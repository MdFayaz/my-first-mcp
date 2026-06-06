import { NotificationService } from "./notifications/notificationService.js";
import { scanMarket } from "./scanner/marketScanner.js";
import { NotificationEventType } from "./notifications/notificationTypes.js";

console.log("Starting scan...");

const notificationService = new NotificationService();

const results = await scanMarket();

console.log(`Scan complete. Results: ${results.length}`);

const qualifiedSignals = results.filter(
	(signal) =>
		signal.qualified === "YES" &&
		(signal.signal === "BUY" || signal.signal === "STRONG BUY"),
);

console.log(`Qualified alerts found: ${qualifiedSignals.length}`);

for (const signal of qualifiedSignals) {
	console.log(`Sending alert for ${signal.symbol}`);

	await notificationService.send({
		eventType: NotificationEventType.SIGNAL,

		symbol: signal.symbol,
		signal: signal.signal,
		confidence: signal.confidence,
		score: signal.combinedScore,
		entryPrice: signal.entryPrice,
		qualified: signal.qualified,
	});
}

console.log("Alert test complete");
