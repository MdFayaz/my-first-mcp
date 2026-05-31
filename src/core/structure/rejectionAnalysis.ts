interface Candle {
	open: number;
	close: number;
	high: number;
	low: number;
}

export interface RejectionSignal {
	bullishRejection: boolean;
	bearishRejection: boolean;
	rejectionStrength: number;
}

export function analyzeRejection(candle: Candle): RejectionSignal {
	const body = Math.abs(candle.close - candle.open);

	const upperWick = candle.high - Math.max(candle.open, candle.close);

	const lowerWick = Math.min(candle.open, candle.close) - candle.low;

	const bullishRejection = lowerWick > body * 2;

	const bearishRejection = upperWick > body * 2;

	let rejectionStrength = 0;

	if (bullishRejection || bearishRejection) {
		const wickRatio = Math.max(upperWick, lowerWick) / (body || 1);

		rejectionStrength = Math.min(wickRatio * 25, 100);
	}

	return {
		bullishRejection,
		bearishRejection,
		rejectionStrength,
	};
}
