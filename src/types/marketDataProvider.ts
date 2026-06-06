import type { Candle } from "../core/indicators/types.js";
export type MarketInterval =
	| "1m"
	| "2m"
	| "5m"
	| "15m"
	| "30m"
	| "60m"
	| "90m"
	| "1h"
	| "1d"
	| "5d"
	| "1wk"
	| "1mo"
	| "3mo";

export type MarketRange = "1d" | "5d" | "1mo" | "3mo" | "6mo" | "1y" | "2y";

export interface MarketDataProvider {
	getCandles(
		symbol: string,
		interval: MarketInterval,
		range?: MarketRange,
	): Promise<Candle[]>;

	getHistoricalCandles(
		symbol: string,
		interval: MarketInterval,
		startDate: string,
		endDate: string,
	): Promise<Candle[]>;
}
