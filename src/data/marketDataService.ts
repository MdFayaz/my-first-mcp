import { YahooProvider } from "./providers/yahooProvider.js";
import type {
	MarketInterval,
	MarketRange,
} from "../types/marketDataProvider.js";
const provider = new YahooProvider();

export async function getMarketData(
	symbol: string,
	interval: MarketInterval,
	range: MarketRange = "5d",
) {
	return provider.getCandles(symbol, interval, range);
}
