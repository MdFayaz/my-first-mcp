import { MACD } from "technicalindicators";

export function calculateMACD(
	closes: number[],
	returnHistory: boolean = false,
) {
	const macd = MACD.calculate({
		values: closes,
		fastPeriod: 12,
		slowPeriod: 26,
		signalPeriod: 9,
		SimpleMAOscillator: false,
		SimpleMASignal: false,
	});

	if (returnHistory) {
		return macd;
	}

	return (
		macd[macd.length - 1] ?? {
			MACD: 0,
			signal: 0,
			histogram: 0,
		}
	);
}

export function normalizeMACD(histogram: number): number {
	return Math.max(-100, Math.min(histogram * 40, 100));
}
