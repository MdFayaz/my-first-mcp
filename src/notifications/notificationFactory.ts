import type { NotificationMessage } from "./notificationMessage.js";
import { NotificationType } from "./notificationType.js";

export class NotificationFactory {
	static create(type: NotificationType, message: string): NotificationMessage {
		return {
			type,
			message,
		};
	}
}
