import { YahooProvider } from "./data/providers/yahooProvider.js";

const provider = new YahooProvider();

const candles = await provider.getHistoricalCandles(
	"RELIANCE.NS",
	"1d",
	"2026-05-01",
	"2026-05-31",
);

console.log(`Candles: ${candles.length}`);

console.log(candles.slice(0, 3));

console.log(candles.slice(-3));
