export interface SRLevel {
	price: number;

	type: "SUPPORT" | "RESISTANCE";

	touches: number;

	strength: number;
}

interface Candle {
	high: number;

	low: number;

	close: number;
}

export function detectSupportResistance(
	candles: Candle[],
	lookback = 2,
	tolerancePercent = 0.4,
	maxLevelsBack = 80,
): SRLevel[] {
	const levels: SRLevel[] = [];
	const recentCandles = candles.slice(-maxLevelsBack);

	for (let i = lookback; i < recentCandles.length - lookback; i++) {
		const current = recentCandles[i];

		if (!current) {
			continue;
		}

		let isSupport = true;

		let isResistance = true;

		for (let j = 1; j <= lookback; j++) {
			const left = recentCandles[i - j];

			const right = recentCandles[i + j];

			if (!left || !right) {
				continue;
			}

			// ======================
			// SUPPORT CHECK
			// ======================

			if (current.low > left.low || current.low > right.low) {
				isSupport = false;
			}

			// ======================
			// RESISTANCE CHECK
			// ======================

			if (current.high < left.high || current.high < right.high) {
				isResistance = false;
			}
		}

		// ======================
		// ADD SUPPORT
		// ======================

		if (isSupport) {
			addLevel(levels, current.low, "SUPPORT", tolerancePercent);
		}

		// ======================
		// ADD RESISTANCE
		// ======================

		if (isResistance) {
			addLevel(levels, current.high, "RESISTANCE", tolerancePercent);
		}
	}

	return levels.map((level) => ({
		...level,

		strength: calculateStrength(level),
	}));
}

function addLevel(
	levels: SRLevel[],
	price: number,
	type: "SUPPORT" | "RESISTANCE",
	tolerancePercent: number,
) {
	const tolerance = (price * tolerancePercent) / 100;

	const existing = levels.find(
		(level) =>
			level.type === type && Math.abs(level.price - price) <= tolerance,
	);

	if (existing) {
		existing.touches += 1;

		// Average clustered level
		existing.price = (existing.price + price) / 2;
	} else {
		levels.push({
			price,

			type,

			touches: 1,

			strength: 0,
		});
	}
}

function calculateStrength(level: SRLevel): number {
	let strength = 0;

	// ======================
	// TOUCH-BASED STRENGTH
	// ======================

	strength += level.touches * 20;

	return Math.min(strength, 100);
}
