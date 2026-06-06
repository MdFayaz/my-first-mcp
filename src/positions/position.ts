export enum PositionStatus {
	OPEN = "OPEN",
	CLOSED = "CLOSED",
}

export interface Position {
	id: string;

	symbol: string;

	signal: string;

	entryPrice: number;

	recommendedHoldDays: number;

	openedAt: string;

	status: PositionStatus;
}
