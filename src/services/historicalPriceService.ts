import { YahooProvider } from "../data/providers/yahooProvider.js";

export class HistoricalPriceService {
	constructor(private readonly provider = new YahooProvider()) {}

	async getCloseAfterTradingDays(
		symbol: string,
		signalDate: string,
		tradingDays: number,
	): Promise<number | null> {
		const startDate = signalDate;

		const endDate = new Date(Date.parse(signalDate));

		endDate.setDate(endDate.getDate() + 30);

		const candles = await this.provider.getHistoricalCandles(
			symbol,
			"1d",
			startDate,
			endDate.toISOString().split("T")[0]!,
		);

		const validCandles = candles.filter((candle) => candle.volume > 0);

		if (validCandles.length <= tradingDays) {
			return null;
		}

		const targetCandle = validCandles[tradingDays];

		if (!targetCandle) {
			return null;
		}

		return targetCandle.close;
	}
}
