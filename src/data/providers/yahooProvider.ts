import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

import type { Candle } from "../../core/indicators/types.js";
import type {
	MarketDataProvider,
	MarketInterval,
	MarketRange,
} from "../../types/marketDataProvider.js";

export class YahooProvider implements MarketDataProvider {
	async getCandles(
		symbol: string,
		interval: MarketInterval,
		range: MarketRange = "5d",
	): Promise<Candle[]> {
		const result: any = await yahooFinance.chart(symbol, {
			interval,
			period1: getPeriod1(range),
		});

		return (
			result.quotes?.map((candle: any) => ({
				timestamp: candle.date?.toISOString(),

				open: candle.open ?? 0,
				high: candle.high ?? 0,
				low: candle.low ?? 0,
				close: candle.close ?? 0,
				volume: candle.volume ?? 0,
			})) || []
		);
	}

	async getHistoricalCandles(
		symbol: string,
		interval: MarketInterval,
		startDate: string,
		endDate: string,
	): Promise<Candle[]> {
		const result: any = await yahooFinance.chart(symbol, {
			interval,

			period1: startDate,

			period2: endDate,
		});

		return (
			result.quotes?.map((candle: any) => ({
				timestamp: candle.date?.toISOString(),

				open: candle.open ?? 0,

				high: candle.high ?? 0,

				low: candle.low ?? 0,

				close: candle.close ?? 0,

				volume: candle.volume ?? 0,
			})) || []
		);
	}
}

function getPeriod1(range: MarketRange): string {
	const now = new Date();

	switch (range) {
		case "1d":
			now.setDate(now.getDate() - 1);
			break;

		case "5d":
			now.setDate(now.getDate() - 5);
			break;

		case "1mo":
			now.setMonth(now.getMonth() - 1);
			break;

		case "3mo":
			now.setMonth(now.getMonth() - 3);
			break;

		case "6mo":
			now.setMonth(now.getMonth() - 6);
			break;

		case "1y":
			now.setFullYear(now.getFullYear() - 1);
			break;

		case "2y":
			now.setFullYear(now.getFullYear() - 2);
			break;
	}

	return now.toISOString().split("T")[0]!;
}
