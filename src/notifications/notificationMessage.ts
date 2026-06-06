import { NotificationType } from "./notificationType.js";

export interface NotificationMessage {
	type: NotificationType;

	message: string;
}
