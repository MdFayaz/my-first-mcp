import { SMA } from "technicalindicators";

export function calculateSMA(closes: number[], period: number = 20): number {
	if (closes.length < period) {
		return 0;
	}

	const sma = SMA.calculate({
		values: closes,
		period,
	});

	return sma[sma.length - 1] ?? 0;
}
