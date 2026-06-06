import { type NotificationMessage, type Notifier } from "./notifier.js";

export class ConsoleNotifier implements Notifier {
	async send(message: NotificationMessage): Promise<void> {
		console.log("");
		console.log("===== SIGNAL ALERT =====");

		console.log(`Symbol     : ${message.symbol}`);
		console.log(`Signal     : ${message.signal}`);
		console.log(`Confidence : ${message.confidence}`);
		console.log(`Score      : ${message.score}`);
		console.log(`Entry      : ${message.entryPrice}`);

		console.log(`Qualified  : ${message.qualified}`);

		console.log("========================");
		console.log("");
	}
}
