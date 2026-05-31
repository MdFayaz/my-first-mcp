import type { BreakoutEngineResult } from "../structure/breakoutEngine.js";

import type { FakeBreakoutResult } from "../structure/fakeBreakoutDetector.js";

import type { RetestResult } from "../structure/retestValidator.js";

export function calculateBreakoutScore(
	breakout: BreakoutEngineResult,
	fakeout: FakeBreakoutResult,
	retest: RetestResult,
): number {
	let score = 0;

	// ======================
	// Confirmed breakout
	// ======================

	if (breakout.breakout) score += 25;

	// ======================
	// Strong candle close
	// ======================

	if (breakout.candleCloseStrength > 1) score += 10;

	// ======================
	// Strong momentum breakout
	// ======================

	if (breakout.breakoutStrength > 2) score += 15;

	// ======================
	// Retest confirmation
	// ======================

	if (retest.retestConfirmed) score += 20;

	// ======================
	// Fake breakout penalty
	// ======================

	if (fakeout.fakeBreakout) score -= 30;

	return score;
}
