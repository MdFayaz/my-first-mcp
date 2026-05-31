export function buildReasons({
	score,

	mtfBias,

	alignment,

	breakout,

	fakeBreakout,

	retestConfirmed,

	trend,

	rsi,

	macdHistogram,
	vwapPosition,

	vwapDistance,
}: any) {
	const reasons: string[] = [];

	// ======================
	// MTF CONTEXT
	// ======================

	if (alignment === "FULL_BULLISH") {
		reasons.push("Full bullish multi-timeframe alignment");
	}

	if (alignment === "PARTIAL_BULLISH") {
		reasons.push("Partial bullish alignment");
	}

	if (alignment === "FULL_BEARISH") {
		reasons.push("Full bearish multi-timeframe alignment");
	}

	if (alignment === "PARTIAL_BEARISH") {
		reasons.push("Partial bearish alignment");
	}

	// ======================
	// TREND
	// ======================

	if (trend === "BULLISH") {
		reasons.push("EMA bullish trend structure");
	}

	if (trend === "BEARISH") {
		reasons.push("EMA bearish trend structure");
	}

	// ======================
	// BREAKOUTS
	// ======================

	if (breakout) {
		reasons.push("Breakout confirmation detected");
	}

	if (retestConfirmed) {
		reasons.push("Retest validation confirmed");
	}

	if (fakeBreakout) {
		reasons.push("Potential fake breakout risk");
	}

	// ======================
	// RSI
	// ======================

	if (rsi >= 70) {
		reasons.push("Strong bullish momentum (high RSI)");
	}

	if (rsi <= 30) {
		reasons.push("Strong bearish momentum (low RSI)");
	}

	// ======================
	// MACD
	// ======================

	if (macdHistogram > 0) {
		reasons.push("Positive MACD momentum");
	}

	if (macdHistogram < 0) {
		reasons.push("Negative MACD momentum");
	}

	// ======================
	// SCORE CONTEXT
	// ======================

	if (score >= 40) {
		reasons.push("High bullish confluence score");
	}

	if (score <= -40) {
		reasons.push("High bearish confluence score");
	}

	// ======================
	// VWAP
	// ======================

	if (vwapPosition === "ABOVE") {
		reasons.push("Price trading above VWAP");
	}

	if (vwapPosition === "BELOW") {
		reasons.push("Price trading below VWAP");
	}

	if (Math.abs(vwapDistance) > 1.5) {
		reasons.push("Strong VWAP displacement");
	}
	return reasons;
}
