import { ExitReviewAlertService } from "./positions/exitReviewAlertService.js";
import { ReviewAlertDeduplicationService } from "./positions/reviewAlertDeduplicationService.js";

const alertService = new ExitReviewAlertService();

const deduplicationService = new ReviewAlertDeduplicationService();

const alerts = alertService.getAlerts();

const newAlerts = deduplicationService.filterNewAlerts(alerts);

console.log(`Review alerts: ${alerts.length}`);

console.log(`New alerts: ${newAlerts.length}`);

console.log(JSON.stringify(newAlerts, null, 2));
