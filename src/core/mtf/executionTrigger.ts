interface ExecutionTriggerInput {
	htfBias: "BULLISH" | "BEARISH" | "NEUTRAL";

	alignment:
		| "FULL_BULLISH"
		| "FULL_BEARISH"
		| "PARTIAL_BULLISH"
		| "PARTIAL_BEARISH"
		| "MIXED";

	breakout: boolean;

	breakoutDirection?: "BULLISH" | "BEARISH" | "NONE";

	fakeBreakout: boolean;

	retestConfirmed: boolean;

	momentumAligned: boolean;

	confluenceScore: number;
}

export interface ExecutionTriggerResult {
	valid: boolean;

	direction?: "LONG" | "SHORT";

	reason: string;
}

export function validateExecutionTrigger({
	htfBias,

	alignment,

	breakout,

	breakoutDirection,

	fakeBreakout,

	retestConfirmed,

	momentumAligned,

	confluenceScore,
}: ExecutionTriggerInput): ExecutionTriggerResult {
	// ======================
	// HARD REJECTIONS
	// ======================

	if (fakeBreakout) {
		return {
			valid: false,

			reason: "Fake breakout detected",
		};
	}

	if (alignment === "MIXED" && Math.abs(confluenceScore) < 25) {
		return {
			valid: false,

			reason: "Mixed timeframe alignment",
		};
	}

	// ======================
	// BREAKOUT VALIDATION
	// ======================

	if (breakout && !retestConfirmed && Math.abs(confluenceScore) < 28) {
		return {
			valid: false,

			reason: "Retest confirmation missing",
		};
	}

	// ======================
	// BULLISH EXECUTION
	// ======================

	if (
		htfBias === "BULLISH" &&
		breakoutDirection === "BULLISH" &&
		momentumAligned &&
		confluenceScore >= 18
	) {
		return {
			valid: true,

			direction: "LONG",

			reason: "Bullish execution confirmed",
		};
	}

	// ======================
	// BEARISH EXECUTION
	// ======================

	if (
		htfBias === "BEARISH" &&
		breakoutDirection === "BEARISH" &&
		momentumAligned &&
		confluenceScore <= -18
	) {
		return {
			valid: true,

			direction: "SHORT",

			reason: "Bearish execution confirmed",
		};
	}

	if (
		htfBias === "BULLISH" &&
		momentumAligned &&
		confluenceScore >= 26 &&
		(alignment === "FULL_BULLISH" || alignment === "PARTIAL_BULLISH")
	) {
		return {
			valid: true,

			direction: "LONG",

			reason: "Bullish continuation trend",
		};
	}

	if (
		htfBias === "BEARISH" &&
		momentumAligned &&
		confluenceScore <= -26 &&
		(alignment === "FULL_BEARISH" || alignment === "PARTIAL_BEARISH")
	) {
		return {
			valid: true,

			direction: "SHORT",

			reason: "Bearish continuation trend",
		};
	}

	return {
		valid: false,

		reason: "Execution conditions incomplete",
	};
}
