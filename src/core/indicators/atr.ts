import { ATR } from "technicalindicators";

export function calculateATR(
	highs: number[],
	lows: number[],
	closes: number[],
	period: number = 14,
): number {
	if (closes.length < period) {
		return 0;
	}

	const atr = ATR.calculate({
		high: highs,
		low: lows,
		close: closes,
		period,
	});

	return atr[atr.length - 1] ?? 0;
}

export function normalizeATR(atr: number, price: number): number {
	const percent = (atr / price) * 100;

	return Math.min(percent * 20, 100);
}
