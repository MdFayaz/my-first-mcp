import {
	type NotificationConfig,
	type NotificationMessage,
	type Notifier,
	NotificationChannel,
} from "./notificationTypes.js";
import { NotificationEventType } from "./notificationTypes.js";

import { TelegramNotifier } from "../notifications/notifiers/telegramNotifier.js";
import { AlertDeduplicationService } from "./alertDeduplicationService.js";
import { PositionRegistryService } from "../positions/positionRegistryService.js";
import { AlertDecision } from "./alertDecision.js";

export class NotificationService {
	private readonly notifiers: Notifier[];
	private readonly positionRegistry = new PositionRegistryService();

	dedupeService = new AlertDeduplicationService();

	constructor(config?: NotificationConfig) {
		const channels = config?.channels ?? [NotificationChannel.TELEGRAM];

		this.notifiers = [];

		for (const channel of channels) {
			switch (channel) {
				case NotificationChannel.TELEGRAM:
					this.notifiers.push(new TelegramNotifier());
					break;
			}
		}
	}

	async send(message: NotificationMessage): Promise<void> {
		if (
			message.eventType === NotificationEventType.SIGNAL &&
			message.alertDecision === AlertDecision.NEW_SIGNAL
		) {
			if (
				message.eventType === NotificationEventType.SIGNAL &&
				message.alertDecision === AlertDecision.NEW_SIGNAL
			) {
				this.positionRegistry.registerPosition(
					message.symbol,
					message.signal,
					message.entryPrice,
				);
			}
		}

		for (const notifier of this.notifiers) {
			await notifier.send(message);
		}
	}
}
