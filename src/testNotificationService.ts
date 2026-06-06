import { AlertDecision } from "./notifications/alertDecision.js";
import { NotificationService } from "./notifications/notificationService.js";
import { NotificationEventType } from "./notifications/notificationTypes.js";

const service = new NotificationService();

await service.send({
	eventType: NotificationEventType.SIGNAL,

	symbol: "ICICIBANK.NS",
	signal: "STRONG BUY",

	confidence: 100,
	score: 121.39,

	entryPrice: 1262.1,

	qualified: "YES",

	alertDecision: AlertDecision.NEW_SIGNAL,
});
