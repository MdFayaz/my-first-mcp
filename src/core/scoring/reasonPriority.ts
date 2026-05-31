export interface PrioritizedReason {
	reason: string;

	priority: number;
}

const PRIORITY_MAP: Record<string, number> = {
	// ======================
	// HIGH PRIORITY
	// ======================

	"Price above VWAP": 100,

	"Price below VWAP": 100,

	"Strong volume expansion": 95,

	"Extreme momentum expansion": 95,

	"High relative volume participation": 90,

	"Extreme institutional participation": 90,

	"EMA bullish trend": 85,

	"EMA bearish trend": 85,

	// ======================
	// MEDIUM PRIORITY
	// ======================

	"MACD bullish crossover": 70,

	"MACD bearish crossover": 70,

	"Bullish momentum increasing": 65,

	"Bearish momentum increasing": 65,

	"Price above SMA20": 60,

	"Price below SMA20": 60,

	// ======================
	// LOW PRIORITY
	// ======================

	"Bullish Marubozu": 40,

	"Bearish Marubozu": 40,

	"Weak momentum expansion": 30,

	"Weak volume participation": 30,
};

export function prioritizeReasons(
	reasons: string[],

	limit = 8,
): string[] {
	const scored: PrioritizedReason[] = reasons.map((reason) => {
		let score = 10;

		for (const key of Object.keys(PRIORITY_MAP)) {
			if (reason.includes(key)) {
				score = PRIORITY_MAP[key] ?? 10;

				break;
			}
		}

		return {
			reason,

			priority: score,
		};
	});

	scored.sort((a, b) => b.priority - a.priority);

	return scored.slice(0, limit).map((r) => r.reason);
}
