import type { Candle } from "../indicators/types.js";

import type { SRLevel } from "./supportResistance.js";

export interface FakeBreakoutResult {
	fakeBreakout: boolean;

	direction: "BULLISH" | "BEARISH" | "NONE";

	rejectionStrength: number;
}

export function detectFakeBreakout(
	candles: Candle[],
	srLevels: SRLevel[],
	rvol?: number,
	expansionRatio?: number,
): FakeBreakoutResult {
	// ======================
	// SAFETY CHECK
	// ======================

	if (!candles.length) {
		return {
			fakeBreakout: false,
			direction: "NONE",
			rejectionStrength: 0,
		};
	}

	const latest = candles[candles.length - 1]!;

	const resistance = srLevels.find((level) => level.type === "RESISTANCE");

	const support = srLevels.find((level) => level.type === "SUPPORT");
	const weakParticipation = (rvol ?? 0) < 1;

	const weakExpansion = (expansionRatio ?? 0) < 1;

	// ======================
	// BULL TRAP
	// ======================

	if (
		resistance &&
		latest.high > resistance.price &&
		latest.close < resistance.price
	) {
		const rejectionStrength = latest.high - latest.close;

		return {
			fakeBreakout: weakParticipation && weakExpansion,

			direction: "BEARISH",

			rejectionStrength: Number(rejectionStrength.toFixed(2)),
		};
	}

	// ======================
	// BEAR TRAP
	// ======================

	if (support && latest.low < support.price && latest.close > support.price) {
		const rejectionStrength = latest.close - latest.low;

		return {
			fakeBreakout: weakParticipation && weakExpansion,

			direction: "BULLISH",

			rejectionStrength: Number(rejectionStrength.toFixed(2)),
		};
	}

	return {
		fakeBreakout: false,

		direction: "NONE",

		rejectionStrength: 0,
	};
}
