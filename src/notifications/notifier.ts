export interface NotificationMessage {
	symbol: string;

	signal: string;

	confidence: number;

	score: number;

	entryPrice?: number;

	qualified?: string;
}

export interface Notifier {
	send(message: NotificationMessage): Promise<void>;
}
