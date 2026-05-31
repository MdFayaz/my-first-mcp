const timeframeWeights: Record<string, number> = {
	"1m": 1,
	"5m": 2,
	"15m": 4,
	"1h": 6,
	"4h": 10,
};

export interface TimeframeAnalysis {
	signal: string;
	trend?: string;
}

export interface MultiTimeframeResult {
	score: number;

	bias: "BULLISH" | "BEARISH" | "NEUTRAL";

	confidence: number;

	alignment:
		| "FULL_BULLISH"
		| "FULL_BEARISH"
		| "PARTIAL_BULLISH"
		| "PARTIAL_BEARISH"
		| "MIXED";
}

export function calculateMultiTimeframeScore(
	analyses: Record<string, TimeframeAnalysis>,
): MultiTimeframeResult {
	let bullishScore = 0;
	let bearishScore = 0;

	let bullishCount = 0;
	let bearishCount = 0;

	for (const [timeframe, analysis] of Object.entries(analyses)) {
		const weight = timeframeWeights[timeframe] || 1;

		// ======================
		// BULLISH SIGNALS
		// ======================

		if (analysis.signal === "BUY" || analysis.signal === "STRONG BUY") {
			bullishScore += weight;
			bullishCount++;
		}

		// ======================
		// BEARISH SIGNALS
		// ======================

		if (analysis.signal === "SELL" || analysis.signal === "STRONG SELL") {
			bearishScore += weight;
			bearishCount++;
		}

		// ======================
		// WAIT STATES
		// ======================

		if (analysis.signal === "WAIT") {
			// lightweight directional bias
			if (analysis.trend === "BULLISH") {
				bullishScore += weight * 0.3;
			}

			if (analysis.trend === "BEARISH") {
				bearishScore += weight * 0.3;
			}
		}
	}

	const total = bullishScore + bearishScore;

	let bias: MultiTimeframeResult["bias"] = "NEUTRAL";

	if (bullishScore > bearishScore) {
		bias = "BULLISH";
	}

	if (bearishScore > bullishScore) {
		bias = "BEARISH";
	}

	const dominantScore = Math.max(bullishScore, bearishScore);

	const confidence =
		total > 0 ? Number(((dominantScore / total) * 100).toFixed(2)) : 0;

	const totalCounts = bullishCount + bearishCount;

	let alignment: MultiTimeframeResult["alignment"] = "MIXED";

	if (bullishCount === totalCounts && totalCounts > 0) {
		alignment = "FULL_BULLISH";
	} else if (bearishCount === totalCounts && totalCounts > 0) {
		alignment = "FULL_BEARISH";
	} else if (bullishCount > bearishCount) {
		alignment = "PARTIAL_BULLISH";
	} else if (bearishCount > bullishCount) {
		alignment = "PARTIAL_BEARISH";
	}

	return {
		score: confidence,
		bias,
		confidence,
		alignment,
	};
}
