import type { ExitReviewAlert } from "./exitReviewAlertService.js";

import {
	NotificationEventType,
	type NotificationMessage,
} from "../notifications/notificationTypes.js";

export class ReviewAlertNotificationService {
	buildNotifications(alerts: ExitReviewAlert[]): NotificationMessage[] {
		return alerts.map((alert) => ({
			eventType: NotificationEventType.POSITION_REVIEW,

			message: [
				"⚠️ POSITION REVIEW REQUIRED",
				"",
				`Symbol: ${alert.symbol}`,
				`Signal: ${alert.signal}`,
				"",
				`Days Held: ${alert.daysHeld}`,
				`Recommended Hold: ${alert.recommendedHoldDays}`,
				"",
				"Reason:",
				alert.reason,
				"",
				"Review position for possible exit.",
			].join("\n"),
		}));
	}
}
