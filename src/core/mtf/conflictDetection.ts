export function detectMTFConflict(htfBias: string, executionSignal: string) {
	const bullishExec = executionSignal.includes("BUY");

	const bearishExec = executionSignal.includes("SELL");

	if (htfBias === "BULLISH" && bearishExec) {
		return {
			conflict: true,
			severity: "HIGH",
		};
	}

	if (htfBias === "BEARISH" && bullishExec) {
		return {
			conflict: true,
			severity: "HIGH",
		};
	}

	return {
		conflict: false,
		severity: "LOW",
	};
}
