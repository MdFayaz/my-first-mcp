export function detectTrendAlignment(analyses: Record<string, any>) {
	let bullish = 0;
	let bearish = 0;

	for (const data of Object.values(analyses)) {
		if (data.trend === "Bullish") bullish++;
		if (data.trend === "Bearish") bearish++;
	}

	const total = bullish + bearish;

	const alignment =
		bullish === total
			? "FULL_BULLISH"
			: bearish === total
				? "FULL_BEARISH"
				: bullish > bearish
					? "PARTIAL_BULLISH"
					: bearish > bullish
						? "PARTIAL_BEARISH"
						: "MIXED";

	return {
		alignment,
		bullish,
		bearish,
		strength:
			total > 0
				? Number(((Math.max(bullish, bearish) / total) * 100).toFixed(2))
				: 0,
	};
}
