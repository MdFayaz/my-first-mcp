import { ExitReviewAlertService } from "./positions/exitReviewAlertService.js";

const service = new ExitReviewAlertService();

const alerts = service.getAlerts();

console.log(`Generated ${alerts.length} exit review alerts`);

console.log(JSON.stringify(alerts, null, 2));
