export function calculateHTFBias(analyses: Record<string, any>) {
	const weights: Record<string, number> = {
		"1m": 1,
		"5m": 2,
		"15m": 4,
		"1h": 6,
		"4h": 10,
	};

	let bullish = 0;
	let bearish = 0;

	for (const [tf, data] of Object.entries(analyses)) {
		const weight = weights[tf] || 1;

		if (data.signal.includes("BUY")) {
			bullish += weight;
		}

		if (data.signal.includes("SELL")) {
			bearish += weight;
		}
	}

	const total = bullish + bearish;

	const bias =
		bullish > bearish ? "BULLISH" : bearish > bullish ? "BEARISH" : "NEUTRAL";

	const dominant = Math.max(bullish, bearish);

	return {
		bias,
		score: dominant,
		confidence: total > 0 ? Number(((dominant / total) * 100).toFixed(2)) : 0,
	};
}
