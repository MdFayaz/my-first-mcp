import { calculateRSI } from "./rsi.js";
import { calculateEMA } from "./ema.js";
import { calculateMACD } from "./macd.js";
import { calculateATR } from "./atr.js";
import { calculateSMA } from "./sma.js";

import type { Candle } from "./types.js";

export function analyzeIndicators(candles: Candle[]) {
	const closes = candles.map((c) => c.close);

	const highs = candles.map((c) => c.high);

	const lows = candles.map((c) => c.low);

	const rsi = calculateRSI(closes);

	const ema20 = calculateEMA(closes, 20);

	const ema50 = calculateEMA(closes, 50);

	const sma20 = calculateSMA(closes, 20);

	const macd = calculateMACD(closes);

	const atr = calculateATR(highs, lows, closes, 14);

	return {
		RSI: rsi,

		EMA20: ema20,

		EMA50: ema50,

		SMA20: sma20,

		MACD: macd,

		ATR: atr,
	};
}
