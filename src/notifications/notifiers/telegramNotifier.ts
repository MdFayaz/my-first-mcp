import { env } from "../../config/env.js";
import { AlertDecision } from "../alertDecision.js";
import { HoldingPeriodRecommendationRepository } from "../../analytics/holdingPeriodRecommendationRepository.js";
import {
	NotificationEventType,
	type NotificationMessage,
	type SignalNotificationMessage,
	type Notifier,
} from "../notificationTypes.js";

export class TelegramNotifier implements Notifier {
	private readonly holdingPeriodRepository =
		new HoldingPeriodRecommendationRepository();

	async send(message: NotificationMessage): Promise<void> {
		const text =
			message.eventType === NotificationEventType.POSITION_REVIEW
				? message.message
				: this.buildSignalMessage(message);

		const response = await fetch(
			`https://api.telegram.org/bot${env.telegramBotToken}/sendMessage`,
			{
				method: "POST",

				headers: {
					"Content-Type": "application/json",
				},

				body: JSON.stringify({
					chat_id: Number(env.telegramChatId),

					text,

					parse_mode: "HTML",
				}),
			},
		);

		const body = await response.text();

		if (!response.ok) {
			throw new Error(`Telegram API Error: ${body}`);
		}
	}

	private buildSignalMessage(message: SignalNotificationMessage): string {
		let alertTitle = "📢 SIGNAL";

		switch (message.alertDecision) {
			case AlertDecision.NEW_SIGNAL:
				alertTitle = "🚨 NEW SIGNAL";
				break;

			case AlertDecision.SIGNAL_UPGRADE:
				alertTitle = "🚀 SIGNAL UPGRADE";
				break;

			case AlertDecision.CONFIDENCE_UPGRADE:
				alertTitle = "📈 CONFIDENCE UPGRADE";
				break;
		}

		const recommendation = this.holdingPeriodRepository.getRecommendation(
			message.signal,
		);

		const holdingSection = recommendation
			? [
					"",
					"📈 <b>Holding Intelligence</b>",
					"",
					`⏳ <b>Suggested Hold:</b> ${recommendation.suggestedHoldDays} Days`,
					`🎯 <b>Expected Return:</b> ${recommendation.historicalReturn.toFixed(2)}%`,
					`✅ <b>Historical Win Rate:</b> ${recommendation.historicalWinRate.toFixed(2)}%`,
					`📊 <b>Sample Size:</b> ${recommendation.sampleSize}`,
				]
			: [];

		return [
			`<b>${alertTitle}</b>`,
			"",
			`<b>Symbol:</b> ${message.symbol}`,
			`<b>Signal:</b> ${message.signal}`,
			"",
			`<b>Confidence:</b> ${message.confidence}%`,
			`<b>Score:</b> ${message.score.toFixed(2)}`,
			"",
			`<b>Entry:</b> ₹${message.entryPrice?.toFixed(2) ?? "N/A"}`,
			`<b>Qualified:</b> ${message.qualified ?? "N/A"}`,
			...holdingSection,
		].join("\n");
	}
}
