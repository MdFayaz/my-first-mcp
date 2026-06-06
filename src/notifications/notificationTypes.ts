import { AlertDecision } from "./alertDecision.js";
import { AlertType } from "./alertTypes.js";

export enum NotificationEventType {
	SIGNAL = "SIGNAL",

	POSITION_REVIEW = "POSITION_REVIEW",
}

export enum NotificationChannel {
	TELEGRAM = "TELEGRAM",

	GMAIL = "GMAIL",

	DISCORD = "DISCORD",

	WHATSAPP = "WHATSAPP",
}

export interface SignalNotificationMessage {
	eventType: NotificationEventType.SIGNAL;

	symbol: string;

	signal: string;

	confidence: number;

	score: number;

	entryPrice: number;

	qualified: string;

	alertDecision?: AlertDecision;

	alertType?: AlertType;
}

export interface PositionReviewNotificationMessage {
	eventType: NotificationEventType.POSITION_REVIEW;

	message: string;
}

export type NotificationMessage =
	| SignalNotificationMessage
	| PositionReviewNotificationMessage;

export interface NotificationConfig {
	channels?: NotificationChannel[];
}

export interface Notifier {
	send(message: NotificationMessage): Promise<void>;
}
