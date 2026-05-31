interface SignalInput {
	score: number;

	mtfBias?: "BULLISH" | "BEARISH" | "NEUTRAL";

	alignment?:
		| "FULL_BULLISH"
		| "PARTIAL_BULLISH"
		| "FULL_BEARISH"
		| "PARTIAL_BEARISH"
		| "MIXED";

	confidence?: number;

	breakout?: boolean;

	trendStrength?: number;
}

export function classifySignal({
	score,

	mtfBias = "NEUTRAL",

	alignment = "MIXED",

	confidence = 50,

	breakout = false,

	trendStrength = 0,
}: SignalInput) {
	const strongBullishContext =
		(confidence >= 80 && alignment === "FULL_BULLISH") ||
		(alignment === "PARTIAL_BULLISH" && mtfBias === "BULLISH");

	const strongBearishContext =
		(confidence >= 80 && alignment === "FULL_BEARISH") ||
		(alignment === "PARTIAL_BEARISH" && mtfBias === "BEARISH");

	// ======================
	// STRONG BUY
	// ======================

	if (score >= 40 && strongBullishContext && (breakout || trendStrength >= 8)) {
		return "STRONG BUY";
	}

	// ======================
	// BUY
	// ======================

	if (score >= 25 && (mtFStrongBullish(alignment) || mtfBias === "BULLISH")) {
		return "BUY";
	}

	// ======================
	// STRONG SELL
	// ======================

	if (
		score <= -40 &&
		strongBearishContext &&
		(breakout || trendStrength >= 8)
	) {
		return "STRONG SELL";
	}

	// ======================
	// SELL
	// ======================

	if (score <= -25 && (mtFStrongBearish(alignment) || mtfBias === "BEARISH")) {
		return "SELL";
	}

	return "HOLD";
}

function mtFStrongBullish(alignment: string) {
	return alignment === "FULL_BULLISH" || alignment === "PARTIAL_BULLISH";
}

function mtFStrongBearish(alignment: string) {
	return alignment === "FULL_BEARISH" || alignment === "PARTIAL_BEARISH";
}
