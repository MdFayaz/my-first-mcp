import { analyzeMarket } from "../../src/services/marketAnalyzer.js";

const candles = [
	{ open: 100, high: 105, low: 95, close: 102 },

	{ open: 102, high: 108, low: 96, close: 107 },

	{ open: 107, high: 109, low: 92, close: 94 },

	{ open: 94, high: 100, low: 90, close: 98 },

	{ open: 98, high: 110, low: 97, close: 108 },

	{ open: 108, high: 111, low: 101, close: 104 },

	{ open: 104, high: 107, low: 95, close: 100 },
];

const latestCandle = candles[candles.length - 1];

const indicators = {
	rsi: 68,

	ema20: 108,

	ema50: 104,

	macdHistogram: 1.2,

	atr: 2.5,
};

const result = await analyzeMarket(candles, latestCandle, indicators);

console.log(JSON.stringify(result, null, 2));
