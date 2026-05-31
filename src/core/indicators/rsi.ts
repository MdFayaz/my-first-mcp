// rsi.ts
import { RSI } from "technicalindicators";

export function calculateRSI(closes: number[], period: number = 14): number {
	if (closes.length < period) {
		return 0;
	}

	const rsi = RSI.calculate({
		values: closes,
		period,
	});

	return rsi[rsi.length - 1] ?? 0;
}
