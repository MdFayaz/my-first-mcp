import type { Candle } from "../core/indicators/types.js";

export interface IndicatorResult {
	rsi: number;

	ema20: number;

	ema50: number;

	atr: number;

	macdHistogram: number;
}

export interface MarketAnalyzerInput {
	candles: Candle[];

	latestCandle: Candle;

	indicators: IndicatorResult;
}
