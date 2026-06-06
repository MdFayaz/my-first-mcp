import { ExitReviewAlertService } from "./positions/exitReviewAlertService.js";
import { ReviewAlertDeduplicationService } from "./positions/reviewAlertDeduplicationService.js";
import { ReviewAlertNotificationService } from "./positions/reviewAlertNotificationService.js";
import { NotificationService } from "./notifications/notificationService.js";

const alertService = new ExitReviewAlertService();

const dedupeService = new ReviewAlertDeduplicationService();

const reviewNotificationService = new ReviewAlertNotificationService();

const notificationService = new NotificationService();

const alerts = alertService.getAlerts();

const newAlerts = dedupeService.filterNewAlerts(alerts);

const notifications = reviewNotificationService.buildNotifications(newAlerts);

console.log("Alerts:", alerts.length);

console.log("New Alerts:", newAlerts.length);

console.log("Notifications:", notifications.length);

console.log(`Notifications generated: ${notifications.length}`);

for (const notification of notifications) {
	await notificationService.send(notification);

	console.log(`Sent: ${notification.eventType}`);
}
