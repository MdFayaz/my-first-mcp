import { EMA } from "technicalindicators";

export function calculateEMA(closes: number[], period: number): number {
	if (closes.length < period) {
		return 0;
	}

	const ema = EMA.calculate({
		values: closes,
		period,
	});

	return ema[ema.length - 1] ?? 0;
}
