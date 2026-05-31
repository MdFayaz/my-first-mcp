interface TrendData {
	currentPrice: number;
	sma20: number;
	ema20: number;
	ema50: number;
}

export function trendScore(data: TrendData) {
	let score = 0;
	const reasons: string[] = [];

	// EMA Trend

	if (data.ema20 > data.ema50) {
		score += 25;
		reasons.push("EMA bullish trend");
	} else {
		score -= 25;
		reasons.push("EMA bearish trend");
	}

	// SMA Trend

	if (data.currentPrice > data.sma20) {
		score += 15;
		reasons.push("Price above SMA20");
	} else {
		score -= 15;
		reasons.push("Price below SMA20");
	}

	return {
		score,
		reasons,
	};
}
