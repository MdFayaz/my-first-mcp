import type { Candle } from "../indicators/types.js";

export function bodySize(candle: Candle): number {
	return Math.abs(candle.close - candle.open);
}

export function upperWick(candle: Candle): number {
	return candle.high - Math.max(candle.open, candle.close);
}

export function lowerWick(candle: Candle): number {
	return Math.min(candle.open, candle.close) - candle.low;
}

export function isBullish(candle: Candle): boolean {
	return candle.close > candle.open;
}

export function isBearish(candle: Candle): boolean {
	return candle.close < candle.open;
}
